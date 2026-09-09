const mongoose = require("mongoose");

const aiAuditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    feature: {
      type: String,
      required: true,
      enum: [
        "visit_summary",
        "daily_report",
        "inventory_insights",
        "sales_analysis",
        "nl_search",
        "recommendations",
        "parse_text",
      ],
    },
    promptSummary: {
      type: String,
      trim: true,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    latencyMs: {
      type: Number,
      default: 0,
    },
    provider: {
      type: String,
      default: "fallback",
    },
    isFallback: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
    errorMessage: {
      type: String,
      trim: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      index: true,
    },
    query: {
      type: String,
      trim: true,
    },
    response: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ["audit", "report", "search", "inventory"],
      default: "audit",
    },
    version: {
      type: String,
      enum: ["v1", "v2", "v3"],
      default: "v1",
    },
    queryType: {
      type: String,
      enum: ["sql", "vector", "hybrid"],
      default: "sql",
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
    embeddingTimeMs: {
      type: Number,
      default: 0,
    },
    embeddingModel: {
      type: String,
      default: "",
    },
    generationModel: {
      type: String,
      default: "",
    },
    llmResponseTimeMs: {
      type: Number,
      default: 0,
    },
    llmProvider: {
      type: String,
      default: "",
    },
    llmUsage: {
      type: Object,
      default: {},
    },
    retrievalSources: {
      type: Array,
      default: [],
    },
    similarityScore: {
      type: Number,
      default: 0,
    },
    processingPipeline: {
      type: String,
      enum: ["sql", "vector", "hybrid", "none"],
      default: "none",
    },
    language: {
      type: String,
      default: "en",
    },
    region: {
      type: String,
      default: "global",
    },
    isPremiumFeature: {
      type: Boolean,
      default: false,
    },
    subscriptionTier: {
      type: String,
      enum: ["free", "basic", "pro", "enterprise"],
      default: "free",
    },
    conversationId: {
      type: String,
      trim: true,
    },
    messageId: {
      type: String,
      trim: true,
    },
    threadId: {
      type: String,
      trim: true,
    },
    sessionToken: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
    customFilters: {
      type: Array,
      default: [],
    },
    contextDepth: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

aiAuditLogSchema.index({ createdAt: -1 });
aiAuditLogSchema.index({ feature: 1 });
aiAuditLogSchema.index({ user: 1 });

module.exports = mongoose.model("AiAuditLog", aiAuditLogSchema);
