const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const AppError = require("./utils/AppError");

const rateLimit = require("express-rate-limit");
const mongoSanitize = require("./middlewares/mongoSanitize");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Security: Disable Express server fingerprinting
app.disable("x-powered-by");

// Enterprise Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(mongoSanitize);

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 10 : 200, // Max 10 in production, generous in development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts from this IP address. Please try again after 15 minutes.",
  },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Generous ceiling for standard SPA interactivity
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP address. Please try again later.",
  },
});
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  "http://localhost:5173",
  "http://localhost:5000",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);

      // Allow specified origins, Vercel deployments (*.vercel.app), or localhost
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true, // required for httpOnly session cookies
  }),
);

// Serve static uploaded files with HTTP caching
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    maxAge: "1d",
    etag: true,
  }),
);

// Testing / Health Check Route with Authentication Detection
// Method GET -> http://localhost:5000/
// Method GET -> http://localhost:5000/endpoints
app.get("/", async (req, res) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1]);

  let authStatus = {
    authenticated: false,
    message:
      "No token provided. Provide a Bearer token in the Authorization header or a session cookie.",
  };

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (user && user.isActive) {
        authStatus = {
          authenticated: true,
          message: "Token is valid and user session is active.",
          authMethod: req.cookies?.token
            ? "Cookie (HttpOnly)"
            : "Bearer Token Header",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            clinicId: user.clinicId,
            clinicName: user.clinicName,
            clinicDomain: user.clinicDomain,
            clinicStatus: user.clinicStatus,
            isClinicOwner: user.isClinicOwner,
            profilePic: user.profilePic,
            isActive: user.isActive,
          },
        };
      } else if (user && !user.isActive) {
        authStatus = {
          authenticated: false,
          message: "User account has been deactivated.",
        };
      } else {
        authStatus = {
          authenticated: false,
          message: "User belonging to this token no longer exists.",
        };
      }
    } catch (err) {
      authStatus = {
        authenticated: false,
        message: "Invalid or expired token.",
        error: err.message,
      };
    }
  }

  res.status(200).json({
    status: "online",
    service: "SmartClinic Management System Backend API",
    message: "SmartClinic Backend API is active and running! 🏥",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    authTest: authStatus,
    apiRoutes: {
      auth: "/api/auth (POST /login, GET /me, POST /logout)",
      users: "/api/users",
      patients: "/api/patients",
      appointments: "/api/appointments",
      bills: "/api/bills",
      sales: "/api/sales",
      medicines: "/api/medicines",
      suppliers: "/api/suppliers",
      endpoints: "/api/endpoints",
      settings: "/api/settings",
      reports: "/api/reports",
      ai: "/api/ai",
      notifications: "/api/notifications",
      telemedicine: "/api/telemedicine",
    },
  });
});

// Dedicated health endpoint for monitoring & uptime checks
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "SmartClinic Management System Backend API",
  });
});

// Apply Rate Limiters
app.use("/api", apiLimiter);
app.use("/api/auth/login", loginLimiter);

// API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/sales", require("./routes/saleRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/endpoints", require("./routes/endRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/telemedicine", require("./routes/telemedicineRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// 404 Handler for undefined routes (Express 5 compatible fallback)
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler (MUST be the last middleware)
app.use(errorHandler);

module.exports = app;
