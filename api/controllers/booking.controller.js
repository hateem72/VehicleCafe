import Booking from "../models/booking.model.js";
import Parking from "../models/parking.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import QRCode from "qrcode";

export const createBooking = async (req, res, next) => {
  try {
    const { parkingId, startTime, duration } = req.body;
    const parking = await Parking.findById(parkingId);
    if (!parking || !parking.availability) return next(createError(400, "Parking not available!"));

    const totalPrice = parking.pricePerHour * duration * parking.surgeMultiplier;
    const qrCode = await QRCode.toDataURL(JSON.stringify({ bookingId: new Date().toISOString(), parkingId, renterId: req.userId }));

    const booking = new Booking({
      renter: req.userId,
      parking: parkingId,
      startTime,
      endTime: new Date(new Date(startTime).getTime() + duration * 60 * 60 * 1000),
      totalPrice,
      qrCode
    });

    await booking.save();
    parking.availability = false;
    await parking.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { parkingHistory: { parkingId, duration, time: new Date() } }
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

export const checkInOut = async (req, res, next) => {
  try {
    const { bookingId, status } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return next(createError(404, "Booking not found!"));

    booking.status = status;
    if (status === "completed") {
      const parking = await Parking.findById(booking.parking);
      parking.availability = true;
      await parking.save();
    }
    await booking.save();
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};