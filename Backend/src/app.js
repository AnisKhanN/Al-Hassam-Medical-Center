const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const AppError = require("./utils/AppError");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // required so the browser sends/receives the httpOnly cookie
  }),
);

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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
    },
  });
});

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

// 404 Handler for undefined routes (Express 5 compatible fallback)
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler (MUST be the last middleware)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
