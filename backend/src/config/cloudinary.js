import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Check if Cloudinary credentials are available
const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("✅ Cloudinary configured successfully");
} else {
  console.log("⚠️  Cloudinary not configured - image uploads will be disabled");
  console.log(
    "💡 To enable image uploads, add Cloudinary credentials to your .env file:"
  );
  console.log("   CLOUDINARY_CLOUD_NAME=your_cloud_name");
  console.log("   CLOUDINARY_API_KEY=your_api_key");
  console.log("   CLOUDINARY_API_SECRET=your_api_secret");
}

let upload;

if (hasCloudinaryConfig) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "neighborhood-help-board",
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
  });
  upload = multer({ storage: storage });
} else {
  // Fallback to memory storage if Cloudinary is not configured
  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });
}

export default upload;
