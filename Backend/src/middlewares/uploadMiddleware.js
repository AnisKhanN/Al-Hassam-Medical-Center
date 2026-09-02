const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AppError = require("../utils/AppError");

// Base uploads directory
const UPLOAD_BASE_DIR = path.join(__dirname, "../../uploads");

// Ensure upload directory exists
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage configuration for profile pictures
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(UPLOAD_BASE_DIR, "profile");
    ensureDirExists(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `profile-${uniqueSuffix}${ext}`);
  },
});

// File filter: Allow only image formats
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Only JPEG, JPG, PNG, WEBP, and GIF images are allowed.",
        400
      ),
      false
    );
  }
};

// Multer upload instance for profile photos (max 5MB)
const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: imageFileFilter,
});

// Middleware wrapper with custom error handling for single profilePic upload
const uploadProfilePic = (req, res, next) => {
  const upload = uploadProfile.single("profilePic");

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(
          new AppError("File is too large. Maximum allowed size is 5MB.", 400)
        );
      }
      return next(new AppError(`Upload error: ${err.message}`, 400));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

module.exports = {
  uploadProfilePic,
  UPLOAD_BASE_DIR,
};
