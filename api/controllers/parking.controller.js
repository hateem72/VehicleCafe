import Parking from "../models/parking.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import { uploadToImageKit } from "../utils/imagekit.js";

export const createParking = async (req, res, next) => {
  try {
    const { address, vehicleType,headline, description,pricePerHour, lat, lng } = req.body;
    if (req.userRole !== "owner") return next(createError(403, "Only owners can create parking!"));

    if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      return next(createError(400, "Valid latitude and longitude are required"));
    }

    const images = req.files ? await Promise.all(req.files.map(file => uploadToImageKit(file))) : [];

    const parking = new Parking({
      owner: req.userId,
      address,
      heading: headline || "Parking Spot",
      description,
      vehicleType,
      pricePerHour,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      },
      images
    });

    await parking.save();
    res.status(201).json(parking);
  } catch (err) {
    console.error("Error creating parking:", err);
    next(err);
  }
};

export const getNearbyParking = async (req, res, next) => {
  try {
    const { lat, lng, vehicleType, maxDistance, timeOfDay } = req.query;
    const user = await User.findById(req.userId);
    const hour = new Date().getHours();
    const isPeakHour = hour >= 8 && hour <= 18;

    let query = {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance) || 5000
        }
      },
      availability: true
    };

    if (vehicleType) query.vehicleType = vehicleType;
    if (user && user.parkingHistory.length) {
      const preferredTypes = [...new Set(user.parkingHistory.map(h => h.parkingId.vehicleType))];
      query.vehicleType = { $in: preferredTypes.length ? preferredTypes : ["small", "medium", "large"] };
    }
    if (timeOfDay || isPeakHour) {
      query.surgeMultiplier = { $gte: isPeakHour ? 1.2 : 1 };
    }

    const parkingSpots = await Parking.find(query)
      .populate("owner", "username ratings")
      .limit(10);

    for (let spot of parkingSpots) {
      const bookings = await Booking.find({ parking: spot._id });
      if (bookings.length) {
        const avgDuration = bookings.reduce((sum, b) => sum + (b.endTime - b.startTime) / (1000 * 60 * 60), 0) / bookings.length;
        spot.averageDuration = avgDuration;
        await spot.save();
      }
    }

    res.status(200).json(parkingSpots);
  } catch (err) {
    next(err);
  }
};

export const getAllParking = async (req, res, next) => {
  try {
    const parkingSpots = await Parking.find({ availability: true })
      .populate("owner", "username ratings");
    res.status(200).json(parkingSpots);
  } catch (err) {
    console.error("Error fetching all parking:", err);
    next(err);
  }
};

export const updateSurgePricing = async (req, res, next) => {
  try {
    const { parkingId, surgeMultiplier } = req.body;
    const parking = await Parking.findById(parkingId);
    if (!parking) return next(createError(404, "Parking not found!"));
    if (parking.owner.toString() !== req.userId) return next(createError(403, "Unauthorized!"));

    parking.surgeMultiplier = parseFloat(surgeMultiplier) || 1;
    await parking.save();
    res.status(200).json(parking);
  } catch (err) {
    next(err);
  }
};