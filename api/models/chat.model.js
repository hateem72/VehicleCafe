import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model("Chat", ChatSchema);