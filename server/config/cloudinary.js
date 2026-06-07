const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Custom Multer storage engine for Cloudinary v2.
 * Replaces multer-storage-cloudinary which only supports cloudinary@1.x.
 */
class CloudinaryStorage {
  constructor({ params = {} } = {}) {
    this.params = params;
  }

  _handleFile(req, file, cb) {
    const uploadParams =
      typeof this.params === "function"
        ? this.params(req, file)
        : { ...this.params };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadParams,
      (error, result) => {
        if (error) return cb(error);
        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
        });
      },
    );

    file.stream.pipe(uploadStream);
  }

  _removeFile(req, file, cb) {
    if (file.filename) {
      cloudinary.uploader.destroy(file.filename, cb);
    } else {
      cb(null);
    }
  }
}

const uploadImage = multer({
  storage: new CloudinaryStorage({
    params: {
      folder: "dance-academy/images",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
  }),
});

const uploadVideo = multer({
  storage: new CloudinaryStorage({
    params: {
      folder: "dance-academy/videos",
      resource_type: "video",
      allowed_formats: ["mp4", "mov", "avi", "webm"],
    },
  }),
});

const uploadAvatar = multer({
  storage: new CloudinaryStorage({
    params: {
      folder: "dance-academy/avatars",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { width: 300, height: 300, crop: "fill", gravity: "face" },
      ],
    },
  }),
});

module.exports = { cloudinary, uploadImage, uploadVideo, uploadAvatar };
