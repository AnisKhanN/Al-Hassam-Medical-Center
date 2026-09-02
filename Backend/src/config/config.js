const dotenv = require("dotenv");
dotenv.config(); // loads environment variables from .env file into process.env

// Check if required environment variables are defined
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `❌ Environment variable error: [${missingEnvVars.join(", ")}] is not defined in environment variables. Please check your .env file.`,
  );
}

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  appUrl:
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:5000",
  appName:
    process.env.APP_NAME ||
    process.env.NEXT_PUBLIC_APP_NAME ||
    "SmartClinic SaaS",
  openaiApiKey: process.env.OPENAI_API_KEY,
  defaultClinicName: process.env.DEFAULT_CLINIC_NAME || "SmartClinic",
  defaultCurrency: process.env.DEFAULT_CURRENCY || "PKR",
  defaultTimezone: process.env.DEFAULT_TIMEZONE || "Asia/Karachi",
};

module.exports = config;
