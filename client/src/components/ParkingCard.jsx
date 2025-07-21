import { Link } from 'react-router-dom';
import { FaParking, FaRupeeSign, FaCar, FaMapMarkerAlt, FaComment } from 'react-icons/fa';

function ParkingCard({ parking, userLocation }) {
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in km
  };

  const distance = userLocation && parking.location?.coordinates
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        parking.location.coordinates[1],
        parking.location.coordinates[0]
      )
    : 'N/A';

  return (
    <div className="bg-backgroundWhite p-6 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 w-full max-w-md">
      <div className="flex flex-col gap-4">
        {parking.images?.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {parking.images.slice(0, 3).map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Parking ${index}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
        <h4 className="text-xl font-bold text-primaryBlue flex items-center">
          <FaParking className="mr-2 text-primaryYellow" /> {parking.heading}
        </h4>
        <p className="text-gray-600 line-clamp-2">{parking.description}</p>
        <p className="text-gray-600 flex items-center">
          <FaCar className="mr-2" /> Vehicle Type: {parking.vehicleType}
        </p>
        <p className="text-gray-600 flex items-center">
          <FaRupeeSign className="mr-2" /> Price: ₹{parking.pricePerHour}/hour
        </p>
        <p className="text-gray-600 flex items-center">
          <FaMapMarkerAlt className="mr-2" /> Distance: {distance} km
        </p>
        <p className="text-gray-600">Owner: {parking.owner?.username || 'Unknown'}</p>
        <p className="text-gray-600">Rating: {parking.owner?.ratings || 'N/A'}</p>
        <div className="flex gap-4">
          <Link
            to={`/parking/${parking._id}`}
            className="flex-1 p-3 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition text-center flex items-center justify-center"
          >
            <FaParking className="mr-2" /> View Details
          </Link>
          <Link
            to={`/chat/${parking.owner?._id}`}
            className="flex-1 p-3 bg-primaryBlue text-backgroundWhite rounded-lg hover:bg-primaryYellow transition text-center flex items-center justify-center"
          >
            <FaComment className="mr-2" /> Chat with Owner
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ParkingCard;