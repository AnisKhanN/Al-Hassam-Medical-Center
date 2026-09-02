const imagekit = require("../config/imagekitConfig");
const { isImageKitConfigured } = require("../config/imagekitConfig");

/**
 * Upload single file (Buffer, Base64 string, or file URL) to ImageKit
 * @param {Buffer|string} file - File buffer, base64 string, or remote URL
 * @param {string} fileName - File name to be saved as
 * @param {string} folder - Destination folder (e.g. "avatars", "prescriptions", "documents")
 * @param {Array<string>} tags - Optional tags for indexing
 * @returns {Promise<Object>} ImageKit upload response { fileId, url, name, ... }
 */
const uploadImage = async (
  file,
  fileName = "file",
  folder = "uploads",
  tags = [],
) => {
  try {
    const safeFileName = `${Date.now()}-${fileName.replace(/\s+/g, "_")}`;

    const uploadOptions = {
      file: file, // Buffer, base64 string, or URL
      fileName: safeFileName,
      folder: `/smartclinic/${folder}/`,
      useUniqueFileName: false,
      tags: ["smartclinic", folder, "healthcare", ...tags],
    };

    const response = await imagekit.upload(uploadOptions);
    return response;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error(error.message || "Failed to upload image to ImageKit");
  }
};

/**
 * Delete a file from ImageKit by fileId
 * @param {string} fileId - The ImageKit fileId
 * @returns {Promise<Object>} ImageKit deletion response
 */
const deleteImage = async (fileId) => {
  try {
    if (!fileId) {
      throw new Error("File ID is required for deletion");
    }

    const response = await imagekit.deleteFile(fileId);
    return response;
  } catch (error) {
    console.error("ImageKit delete error:", error);
    throw new Error(error.message || "Failed to delete image from ImageKit");
  }
};

/**
 * Generate client-side authentication parameters for direct frontend upload
 * @returns {Object} { token, expire, signature }
 */
const getAuthenticationParameters = () => {
  try {
    return imagekit.getAuthenticationParameters();
  } catch (error) {
    console.error("Error generating ImageKit auth parameters:", error);
    throw new Error("Failed to generate ImageKit authentication parameters");
  }
};

/**
 * Upload multiple files to ImageKit concurrently
 * @param {Array<{buffer: Buffer, originalname: string}>} files - Array of multer file objects
 * @param {string} folder - Destination folder
 * @returns {Promise<Array<Object>>} Array of upload responses
 */
const uploadMultipleImages = async (files = [], folder = "uploads") => {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      return [];
    }

    const uploadPromises = files.map((file) =>
      uploadImage(file.buffer || file, file.originalname || "image", folder),
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("ImageKit multiple uploads error:", error);
    throw new Error(
      error.message || "Failed to upload multiple images to ImageKit",
    );
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  getAuthenticationParameters,
  uploadMultipleImages,
  isImageKitConfigured,
};

