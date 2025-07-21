import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllParking, createChat } from '../utils/api.js';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaParking, FaRupeeSign, FaCar, FaMapMarkerAlt, FaComment, FaUser, FaInfoCircle } from 'react-icons/fa';

function ParkingDetails({ userLocation }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parking, setParking] = useState(null);
  const [error, setError] = useState('');

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

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const spots = await getAllParking();
        const parkingSpot = spots.find(spot => spot._id === id);
        if (!parkingSpot) throw new Error('Parking not found');
        setParking(parkingSpot);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchParking();
  }, [id]);

  const handleChat = async () => {
    try {
      const chat = await createChat(parking.owner._id);
      navigate(`/chat/${chat._id}`);
    } catch (err) {
      setError('Failed to start chat: ' + err.message);
    }
  };

  if (error) return <p className="text-primaryRed text-center mt-16">{error}</p>;
  if (!parking) return <p className="text-primaryBlue text-center mt-16">Loading...</p>;

  const distance = userLocation && parking.location?.coordinates
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        parking.location.coordinates[1],
        parking.location.coordinates[0]
      )
    : 'N/A';

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8 bg-backgroundWhite rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-primaryBlue mb-6 flex items-center">
        <FaParking className="mr-2 text-primaryYellow" /> {parking.heading}
      </h2>
      {parking.images?.length > 0 && (
        <Carousel showThumbs={false} showStatus={false} className="mb-6">
          {parking.images.map((img, index) => (
            <div key={index}>
              <img src={img.url} alt={`Parking ${index}`} className="w-full h-64 object-cover rounded-lg" />
            </div>
          ))}
        </Carousel>
      )}
      <div className="space-y-4">
        <p className="text-gray-600 flex items-center">
          <FaInfoCircle className="mr-2" /> {parking.description}
        </p>
        <p className="text-gray-600 flex items-center">
          <FaCar className="mr-2" /> Vehicle Type: {parking.vehicleType}
        </p>
        <p className="text-gray-600 flex items-center">
          <FaRupeeSign className="mr-2" /> Price: ₹{parking.pricePerHour}/hour
        </p>
        <p className="text-gray-600 flex items-center">
          <FaMapMarkerAlt className="mr-2" /> Address: {parking.address}
        </p>
        <p className="text-gray-600 flex items-center">
          <FaMapMarkerAlt className="mr-2" /> Distance: {distance} km
        </p>
        <p className="text-gray-600 flex items-center">
          <FaUser className="mr-2" /> Owner: {parking.owner?.username || 'Unknown'}
        </p>
        <p className="text-gray-600 flex items-center">
          <FaUser className="mr-2" /> Rating: {parking.owner?.ratings || 'N/A'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/booking/${parking._id}`)}
            className="flex-1 p-3 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition flex items-center justify-center"
          >
            <FaParking className="mr-2" /> Book Now
          </button>
          <button
            onClick={handleChat}
            className="flex-1 p-3 bg-primaryBlue text-backgroundWhite rounded-lg hover:bg-primaryYellow transition flex items-center justify-center"
          >
            <FaComment className="mr-2" /> Chat with Owner
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParkingDetails;