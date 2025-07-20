import { Link } from 'react-router-dom';
import { FaParking } from 'react-icons/fa';

function ParkingCard({ parking }) {
  return (
    <div className="bg-backgroundWhite p-4 rounded-lg shadow-lg">
      <h4 className="text-lg font-semibold text-primaryBlue flex items-center">
        <FaParking className="mr-2" /> {parking.address}
      </h4>
      <p className="text-gray-600">Vehicle Type: {parking.vehicleType}</p>
      <p className="text-gray-600">Price: ${parking.pricePerHour}/hour</p>
      <p className="text-gray-600">Owner: {parking.owner?.username || 'Unknown'}</p>
      <p className="text-gray-600">Rating: {parking.owner?.ratings || 'N/A'}</p>
      <Link
        to={`/booking/${parking._id}`}
        className="mt-2 inline-block bg-primaryGreen text-backgroundWhite px-3 py-1 rounded-lg hover:bg-primaryRed transition"
      >
        Book Now
      </Link>
    </div>
  );
}
export default ParkingCard;