import mongoose from "mongoose";

const ParkingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true  
  },
   heading: {
    type: String,
    required: true,
    default: "Parking Spot",
    minlength: 5,
    maxlength: 100
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
  images: [{
    url: String,
    publicId: String
  }],
  availability: {
    type: Boolean,
    default: true
  },
  surgeMultiplier: {
    type: Number,
    default: 1
  },
  averageDuration: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Index for geospatial queries
ParkingSchema.index({ location: "2dsphere" });

export default mongoose.model("Parking", ParkingSchema);