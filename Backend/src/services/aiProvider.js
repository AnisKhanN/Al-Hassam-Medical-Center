/**
 * Multi-Provider LLM Client Adapter for SmartClinic SaaS
 * Supports Google Gemini (Google AI Pro / v1beta API) as primary provider,
 * OpenAI (v1 chat completions) as secondary adapter,
 * and automatic graceful degradation to Heuristic Fallback for FYP demonstrations.
 */

const getProviderConfig = () => {
  const openAiKey = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("your-openai")
    ? process.env.OPENAI_API_KEY.trim()
    : null;

  const geminiKey = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("your-gemini")
    ? process.env.GEMINI_API_KEY.trim()
    : null;

  const preferredProvider = (process.env.PREFERRED_AI_PROVIDER || "gemini").toLowerCase().trim();

  let activeProvider = "fallback";
  if (preferredProvider === "gemini" && geminiKey) {
    activeProvider = "gemini";
  } else if (preferredProvider === "openai" && openAiKey) {
    activeProvider = "openai";
  } else if (geminiKey) {
    activeProvider = "gemini";
  } else if (openAiKey) {
    activeProvider = "openai";
  }

  return {
    preferredProvider,
    hasOpenAI: !!openAiKey,
    hasGemini: !!geminiKey,
    activeProvider,
    openAiKey,
    geminiKey,
  };
};

/**
 * Utility to strip markdown code blocks from JSON string
 */
const cleanJsonOutput = (text = "") => {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
};

/**
 * Calls OpenAI Chat Completions API
 */
const callOpenAI = async ({ apiKey, systemPrompt, userPrompt, jsonMode = false, maxTokens = 1500, temperature = 0.3 }) => {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    let content = data.choices?.[0]?.message?.content || "";
    if (jsonMode) {
      content = cleanJsonOutput(content);
    }
    const tokensUsed = data.usage?.total_tokens || 0;

    return { content, tokensUsed, provider: "openai", model };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

/**
 * Calls Google Gemini REST API (gemini-1.5-flash / gemini-2.0-flash / Google AI Pro)
 */
const callGemini = async ({ apiKey, systemPrompt, userPrompt, jsonMode = false, maxTokens = 1500, temperature = 0.3 }) => {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  // Use native system_instruction for Gemini v1beta
  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  };

  if (jsonMode) {
    body.generationConfig.responseMimeType = "application/json";
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      // If system_instruction is not supported by a custom model version, retry with combined user prompt
      if (res.status === 400 && errText.includes("system_instruction")) {
        return await callGeminiFallbackPrompt({ apiKey, modelName, systemPrompt, userPrompt, jsonMode, maxTokens, temperature });
      }
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    let textPart = candidate?.content?.parts?.[0]?.text || "";
    if (jsonMode) {
      textPart = cleanJsonOutput(textPart);
    }
    const tokensUsed = (data.usageMetadata?.totalTokenCount) || 0;

    return { content: textPart, tokensUsed, provider: "gemini", model: modelName };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

/**
 * Secondary Gemini fallback with prompt prepending (in case system_instruction is rejected)
 */
const callGeminiFallbackPrompt = async ({ apiKey, modelName, systemPrompt, userPrompt, jsonMode, maxTokens, temperature }) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const contents = [
    {
      role: "user",
      parts: [
        { text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}` },
      ],
    },
  ];
  const generationConfig = {
    temperature,
    maxOutputTokens: maxTokens,
    ...(jsonMode ? { responseMimeType: "application/json" } : {}),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents, generationConfig }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API fallback error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  let textPart = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (jsonMode) {
    textPart = cleanJsonOutput(textPart);
  }
  const tokensUsed = data.usageMetadata?.totalTokenCount || 0;
  return { content: textPart, tokensUsed, provider: "gemini", model: modelName };
};

/**
 * Unified completion dispatcher with automatic provider fallback
 * Priority is given to the preferred provider (Google Gemini by default)
 */
exports.generateAICompletion = async ({
  systemPrompt,
  userPrompt,
  jsonMode = false,
  maxTokens = 1500,
  temperature = 0.3,
}) => {
  const config = getProviderConfig();

  // Helper dispatchers
  const tryGemini = async () => {
    if (!config.hasGemini) return null;
    try {
      const result = await callGemini({
        apiKey: config.geminiKey,
        systemPrompt,
        userPrompt,
        jsonMode,
        maxTokens,
        temperature,
      });
      return { ...result, isFallback: false };
    } catch (err) {
      console.warn("Google Gemini API call failed:", err.message);
      return null;
    }
  };

  const tryOpenAI = async () => {
    if (!config.hasOpenAI) return null;
    try {
      const result = await callOpenAI({
        apiKey: config.openAiKey,
        systemPrompt,
        userPrompt,
        jsonMode,
        maxTokens,
        temperature,
      });
      return { ...result, isFallback: false };
    } catch (err) {
      console.warn("OpenAI API call failed:", err.message);
      return null;
    }
  };

  // Dispatch in order of preference
  if (config.preferredProvider === "openai") {
    const r1 = await tryOpenAI();
    if (r1) return r1;
    const r2 = await tryGemini();
    if (r2) return r2;
  } else {
    // Default: Gemini first
    const r1 = await tryGemini();
    if (r1) return r1;
    const r2 = await tryOpenAI();
    if (r2) return r2;
  }

  // If no external keys work, throw so fallback service handles it cleanly
  throw new Error("No active cloud AI provider succeeded. Triggering deterministic fallback.");
};

exports.getProviderStatus = () => {
  const config = getProviderConfig();
  const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const openAiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

  let activeModel = "Heuristic Viva Engine";
  let providerLabel = "FYP Demo Mode (Heuristic Engine)";

  if (config.activeProvider === "gemini") {
    activeModel = geminiModel;
    providerLabel = `Google Gemini Live (${geminiModel})`;
  } else if (config.activeProvider === "openai") {
    activeModel = openAiModel;
    providerLabel = `OpenAI Live (${openAiModel})`;
  }

  return {
    activeProvider: config.activeProvider,
    preferredProvider: config.preferredProvider,
    hasGemini: config.hasGemini,
    hasOpenAI: config.hasOpenAI,
    geminiModel,
    openAiModel,
    model: activeModel,
    providerLabel,
    fallbackReady: true,
  };
};

exports.cleanJsonOutput = cleanJsonOutput;
