const ImageKit = require("imagekit");

/**
 * Helper to check if ImageKit credentials are validly configured in environment
 * @returns {boolean}
 */
const isImageKitConfigured = () => {
  const pub = process.env.IMAGEKIT_PUBLIC_KEY;
  const priv = process.env.IMAGEKIT_PRIVATE_KEY;
  const url = process.env.IMAGEKIT_URL_ENDPOINT;

  return Boolean(
    pub &&
      priv &&
      url &&
      !pub.includes("your_imagekit_public_key") &&
      !url.includes("your_imagekit_id"),
  );
};

let imagekitInstance = null;

const getImageKit = () => {
  if (!imagekitInstance) {
    if (isImageKitConfigured()) {
      imagekitInstance = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      });
    } else {
      // Safe fallback proxy when ImageKit is not configured, prevents crashes
      imagekitInstance = {
        upload: async (options) => {
          console.warn(
            "⚠️ ImageKit credentials not configured. Mocking upload for:",
            options.fileName,
          );
          return {
            fileId: `mock-${Date.now()}`,
            url:
              options.file &&
              typeof options.file === "string" &&
              options.file.startsWith("http")
                ? options.file
                : `/uploads/${options.fileName}`,
            name: options.fileName,
            thumbnailUrl: `/uploads/${options.fileName}`,
          };
        },
        deleteFile: async (fileId) => {
          console.warn(
            "⚠️ ImageKit credentials not configured. Mocking delete for fileId:",
            fileId,
          );
          return { success: true };
        },
        getAuthenticationParameters: () => {
          return {
            token: `mock-token-${Date.now()}`,
            expire: Math.floor(Date.now() / 1000) + 1800,
            signature: "mock-signature",
          };
        },
      };
    }
  }
  return imagekitInstance;
};

// Proxy allows direct calling of imagekit.upload(), imagekit.deleteFile(), etc.
const imagekitProxy = new Proxy(
  {},
  {
    get: (target, prop) => {
      const ik = getImageKit();
      if (typeof ik[prop] === "function") {
        return ik[prop].bind(ik);
      }
      return ik[prop];
    },
  },
);

module.exports = imagekitProxy;
module.exports.getImageKit = getImageKit;
module.exports.isImageKitConfigured = isImageKitConfigured;

