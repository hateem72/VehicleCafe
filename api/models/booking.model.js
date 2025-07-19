import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  parking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parking",
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  qrCode: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending"
  },
  totalPrice: {
    type: Number
  }
}, { timestamps: true });

export default mongoose.model("Booking", BookingSchema);