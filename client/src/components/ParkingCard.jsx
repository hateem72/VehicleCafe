import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

function ParkingCard({ parking }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
      <img
        src={parking.images[0]?.url || 'https://via.placeholder.com/300'}
        alt="Parking"
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold text-primaryBlue">{parking.address}</h3>
      <p className="text-gray-600">Vehicle Type: {parking.vehicleType}</p>
      <p className="text-gray-600">Price: ${parking.pricePerHour * parking.surgeMultiplier}/hour</p>
      <div className="flex items-center mt-2">
        <FaStar className="text-primaryYellow mr-1" />
        <span>{parking.owner.ratings?.length ? (parking.owner.ratings.reduce((a, b) => a + b.rating, 0) / parking.owner.ratings.length).toFixed(1) : 'No ratings'}</span>
      </div>
      <Link
        to={`/booking/${parking._id}`}
        className="mt-4 inline-block px-4 py-2 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition"
      >
        Book Now
      </Link>
    </div>
  );
}

export default ParkingCard;