import mongoose from "mongoose";

const ParkingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ["small", "medium", "large"],
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  surgeMultiplier: {
    type: Number,
    default: 1
  },
  images: [{
    url: String,
    publicId: String
  }],
  availability: {
    type: Boolean,
    default: true
  },
  averageDuration: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

ParkingSchema.index({ location: "2dsphere" });

export default mongoose.model("Parking", ParkingSchema);