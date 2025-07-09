import path from "node:path";
import { config } from "../config/config";
import multer from "multer";

const storage = multer.diskStorage({
  destination: config.uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const unique = Date.now();
    cb(null, `${base}-${unique}${ext}`);
  },
});

export const upload = multer({ storage });
