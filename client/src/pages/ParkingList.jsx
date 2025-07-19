import { useState, useEffect } from 'react';
import { getNearbyParking } from '../utils/api.js';
import { getRecommendedParking } from '../utils/recommendations.js';
import ParkingCard from '../components/ParkingCard.jsx';
import MapView from '../components/MapView.jsx';
import { FaFilter } from 'react-icons/fa';

function ParkingList() {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [recommendedSpots, setRecommendedSpots] = useState([]);
  const [filters, setFilters] = useState({ vehicleType: '', maxDistance: 5000, price: '' });
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
      }
    );
  }, []);

  useEffect(() => {
    if (userLocation) {
      const fetchParking = async () => {
        try {
          const regularSpots = await getNearbyParking({ ...userLocation, ...filters });
          const recommended = await getRecommendedParking(userLocation, filters.vehicleType, axios);
          setParkingSpots(regularSpots);
          setRecommendedSpots(recommended);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchParking();
    }
  }, [userLocation, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-primaryBlue mb-6">Find Parking</h2>
      {error && <p className="text-primaryRed mb-4">{error}</p>}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-primaryBlue mb-4 flex items-center">
              <FaFilter className="mr-2" /> Filters
            </h3>
            <div className="space-y-4">
              <select
                name="vehicleType"
                value={filters.vehicleType}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">All Vehicle Types</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
              <input
                type="number"
                name="maxDistance"
                value={filters.maxDistance}
                onChange={handleFilterChange}
                placeholder="Max Distance (meters)"
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="number"
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                placeholder="Max Price per Hour"
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-primaryBlue mb-4">Recommended Parking</h3>
          <div className="space-y-4">
            {recommendedSpots.map(spot => (
              <ParkingCard key={spot._id} parking={spot} />
            ))}
          </div>
          <h3 className="text-xl font-semibold text-primaryBlue mt-6 mb-4">All Parking Spots</h3>
          <div className="space-y-4">
            {parkingSpots.map(spot => (
              <ParkingCard key={spot._id} parking={spot} />
            ))}
          </div>
        </div>
        <div className="md:w-2/3">
          {userLocation && <MapView parkingSpots={parkingSpots} userLocation={userLocation} />}
        </div>
      </div>
    </div>
  );
}

export default ParkingList;