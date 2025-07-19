import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["renter", "owner"],
    default: "renter"
  },
  vehicleNumber: {
    type: String,
    default: ""
  },
  profileImage: {
    url: String,
    publicId: String
  },
  ratings: [{
    rating: Number,
    review: String,
    byUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }],
  verified: {
    type: Boolean,
    default: false
  },
  trustedParker: {
    type: Boolean,
    default: false
  },
  parkingHistory: [{
    parkingId: { type: mongoose.Schema.Types.ObjectId, ref: "Parking" },
    duration: Number,
    time: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model("User", UserSchema);