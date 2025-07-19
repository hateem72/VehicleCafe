import express from "express";
import { createParking, getNearbyParking, updateSurgePricing } from "../controllers/parking.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", verifyToken, upload.array("images", 5), createParking);
router.get("/nearby", verifyToken, getNearbyParking);
router.put("/surge", verifyToken, updateSurgePricing);

export default router;