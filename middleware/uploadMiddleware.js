// middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads')); // ✅ absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


// Filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({ storage, fileFilter });


export default upload;
