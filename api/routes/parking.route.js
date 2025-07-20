import express from "express";
import { createParking,  getAllParking, getNearbyParking, updateSurgePricing } from "../controllers/parking.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", verifyToken, upload.array("images", 5), createParking);
router.get("/nearby", verifyToken, getNearbyParking);
router.get("/all", verifyToken, getAllParking);
router.put("/surge", verifyToken, updateSurgePricing);

export default router;