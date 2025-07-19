import express from "express";
import { updateProfile, getProfile } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.put("/profile", verifyToken, upload.single("profileImage"), updateProfile);
router.get("/profile", verifyToken, getProfile);

export default router;