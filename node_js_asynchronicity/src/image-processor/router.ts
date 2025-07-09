import { Router } from "express";
import { controller } from "./controller";
import { upload } from "../utils/multer";

const router = Router();

router.post("/zip", upload.single("images"), controller.process);

export default router;
