import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import { uploadToImageKit } from "../utils/imagekit.js";
import bcrypt from "bcrypt";

export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, vehicleNumber, password } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return next(createError(404, "User not found!"));

    if (username) user.username = username;
    if (email) user.email = email;
    if (vehicleNumber) user.vehicleNumber = vehicleNumber;
    if (password) user.password = bcrypt.hashSync(password, 5);
    if (req.file) {
      const image = await uploadToImageKit(req.file);
      user.profileImage = { url: image.url, publicId: image.publicId };
    }

    await user.save();
    const { password: _, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password").populate("parkingHistory.parkingId", "address");
    if (!user) return next(createError(404, "User not found!"));
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};