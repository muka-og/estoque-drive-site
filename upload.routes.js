import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { uploadFotos } from "../controllers/uploadController.js";

const router = Router();
router.post("/", upload.array("fotos"), uploadFotos);

export default router;
