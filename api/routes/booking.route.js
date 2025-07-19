import express from "express";
import { createBooking, checkInOut } from "../controllers/booking.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.put("/checkinout", verifyToken, checkInOut);

export default router;