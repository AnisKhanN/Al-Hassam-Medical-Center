const nodemailer = require("nodemailer");

/**
 * Creates nodemailer transporter based on environment configuration,
 * or returns a development mock logger if credentials are not configured or invalid.
 */
const createTransporter = () => {
  const host = process.env.EMAIL_SERVER_HOST;
  const port = parseInt(process.env.EMAIL_SERVER_PORT, 10) || 587;
  const user = process.env.EMAIL_SERVER_USER || process.env.EMAIL_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.EMAIL_PASS;
  const service = process.env.EMAIL_SERVICE;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  if (user && pass) {
    return nodemailer.createTransport({
      service: service || "gmail",
      auth: { user, pass },
    });
  }

  // Development fallback mock transporter
  return {
    sendMail: async (options) => {
      console.log("\n================ Mock Email Sent ================");
      console.log(`From: ${options.from}`);
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Content: ${options.text || options.html}`);
      console.log("=================================================\n");
      return { messageId: `mock-${Date.now()}` };
    },
  };
};

/**
 * Send an email notification
 * @param {Object} options - { to, subject, text, html, from }
 * @returns {Promise<Object>} info
 */
const sendMail = async ({ to, subject, text, html, from }) => {
  const senderEmail =
    process.env.EMAIL_SERVER_USER || process.env.EMAIL_USER || "noreply@smartclinic.local";
  const defaultFrom =
    process.env.EMAIL_FROM || `"SmartClinic Support" <${senderEmail}>`;

  const mailOptions = {
    from: from || defaultFrom,
    to,
    subject,
    text,
    html,
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.messageId || "Success");
    return info;
  } catch (error) {
    console.warn("⚠️ SMTP send failed, falling back to mock delivery:", error.message);
    console.log("\n================ Email Fallback Log ================");
    console.log(`From: ${mailOptions.from}`);
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Content: ${mailOptions.text || mailOptions.html}`);
    console.log("====================================================\n");
    return { messageId: `fallback-${Date.now()}`, error: error.message };
  }
};

module.exports = { sendMail };

