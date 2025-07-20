import { useState, useEffect } from 'react';
import { getAllParking, getNearbyParking } from '../utils/api.js';
import { getRecommendedParking } from '../utils/recommendations.js';
import ParkingCard from '../components/ParkingCard.jsx';
import MapView from '../components/MapView.jsx';
import { FaFilter, FaParking } from 'react-icons/fa';
import axios from 'axios';

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
        setError('Geolocation access denied. Using default location.');
      }
    );
  }, []);

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const allSpots = await getAllParking();
        const recommended = userLocation
          ? await getRecommendedParking(userLocation, filters.vehicleType, axios)
          : [];
        setParkingSpots(Array.isArray(allSpots) ? allSpots : []);
        setRecommendedSpots(Array.isArray(recommended) ? recommended : []);
        setError('');
      } catch (err) {
        setError(err.message);
        setParkingSpots([]);
        setRecommendedSpots([]);
      }
    };
    fetchParking();
  }, [userLocation, filters.vehicleType]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-primaryBlue mb-6 flex items-center">
        <FaParking className="mr-2" /> Find Parking
      </h2>
      {error && <p className="text-primaryRed mb-4">{error}</p>}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="bg-backgroundWhite p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-primaryBlue mb-4 flex items-center">
              <FaFilter className="mr-2" /> Filters
            </h3>
            <div className="space-y-4">
              <select
                name="vehicleType"
                value={filters.vehicleType}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
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
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
              />
              <input
                type="number"
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                placeholder="Max Price per Hour"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-primaryBlue mb-4">Recommended Parking</h3>
          <div className="space-y-4">
            {Array.isArray(recommendedSpots) && recommendedSpots.length ? (
              recommendedSpots.map(spot => <ParkingCard key={spot._id} parking={spot} />)
            ) : (
              <p className="text-gray-600">No recommendations available.</p>
            )}
          </div>
          <h3 className="text-xl font-semibold text-primaryBlue mt-6 mb-4">All Available Parking</h3>
          <div className="space-y-4">
            {Array.isArray(parkingSpots) && parkingSpots.length ? (
              parkingSpots.map(spot => <ParkingCard key={spot._id} parking={spot} />)
            ) : (
              <p className="text-gray-600">No parking spots available.</p>
            )}
          </div>
        </div>
        <div className="md:w-2/3">
          {userLocation ? (
            <MapView parkingSpots={parkingSpots} userLocation={userLocation} />
          ) : (
            <p className="text-gray-600">Loading map...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParkingList;