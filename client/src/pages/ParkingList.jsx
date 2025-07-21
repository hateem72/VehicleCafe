import { useState, useEffect, useRef, useContext } from 'react';
import { getAllParking, getNearbyParking } from '../utils/api.js';
import ParkingCard from '../components/ParkingCard.jsx';
import MapView from '../components/MapView.jsx';
import { FaFilter, FaParking, FaMapMarkerAlt } from 'react-icons/fa';
import { GoogleMapsContext } from '../components/GoogleMapsProvider.jsx';
import axios from 'axios';

function ParkingList() {
  const { isLoaded } = useContext(GoogleMapsContext);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [filters, setFilters] = useState({ vehicleType: '', maxDistance: 5000, price: '' });
  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState({ address: '', lat: '', lng: '' });
  const [error, setError] = useState('');
  const autocompleteInputRef = useRef(null);

  useEffect(() => {
    if (isLoaded) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
            );
            const address = response.data.results[0]?.formatted_address || 'Current Location';
            setUserLocation({ lat: latitude, lng: longitude, address });
          } catch (err) {
            setUserLocation({ lat: latitude, lng: longitude, address: 'Current Location' });
            setError('Failed to fetch address for current location.');
          }
        },
        () => {
          setUserLocation({ lat: 37.7749, lng: -122.4194, address: 'San Francisco, CA' });
          setError('Geolocation access denied. Using default location (San Francisco).');
        }
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    const fetchParking = async () => {
      try {
        let spots = [];
        if (searchLocation.lat && searchLocation.lng) {
          spots = await getNearbyParking({
            lat: parseFloat(searchLocation.lat),
            lng: parseFloat(searchLocation.lng),
            vehicleType: filters.vehicleType,
            maxDistance: parseInt(filters.maxDistance),
            price: parseFloat(filters.price)
          });
        } else if (userLocation) {
          spots = await getNearbyParking({
            lat: userLocation.lat,
            lng: userLocation.lng,
            vehicleType: filters.vehicleType,
            maxDistance: parseInt(filters.maxDistance),
            price: parseFloat(filters.price)
          });
        } else {
          spots = await getAllParking({ vehicleType: filters.vehicleType, price: parseFloat(filters.price) });
        }
        setParkingSpots(Array.isArray(spots) ? spots : []);
        setError('');
      } catch (err) {
        setError(err.message);
        setParkingSpots([]);
      }
    };
    if (isLoaded) fetchParking();
  }, [userLocation, searchLocation, filters, isLoaded]);

  const handlePlaceChanged = () => {
    if (autocompleteInputRef.current) {
      const place = autocompleteInputRef.current.getPlace();
      if (place?.geometry) {
        setSearchLocation({
          address: place.formatted_address,
          lat: place.geometry.location.lat().toString(),
          lng: place.geometry.location.lng().toString()
        });
        setError('');
      } else {
        setError('Please select a valid address from the suggestions');
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleUseCurrentLocation = () => {
    setSearchLocation({ address: '', lat: '', lng: '' });
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-primaryBlue mb-6 flex items-center">
        <FaParking className="mr-2 text-primaryYellow" /> Find Parking
      </h2>
      {error && <p className="text-primaryRed mb-4">{error}</p>}
      <div className="flex flex-col gap-8">
        <div className="bg-backgroundWhite p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-primaryBlue mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2" /> Search Location
          </h3>
          {isLoaded && (
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <google-maps-place-autocomplete-element
                ref={autocompleteInputRef}
                onPlaceChange={handlePlaceChanged}
                input-class="w-full sm:w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow transition"
                input-placeholder="Enter location to find parking"
                value={searchLocation.address}
                onInput={(e) => setSearchLocation({ ...searchLocation, address: e.target.value })}
              ></google-maps-place-autocomplete-element>
              <button
                onClick={handleUseCurrentLocation}
                className="w-full sm:w-1/3 p-3 bg-primaryBlue text-backgroundWhite rounded-lg hover:bg-primaryYellow transition flex items-center justify-center"
              >
                <FaMapMarkerAlt className="mr-2" /> Use Current Location
              </button>
            </div>
          )}
          <h3 className="text-xl font-semibold text-primaryBlue mb-4 flex items-center">
            <FaFilter className="mr-2" /> Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              placeholder="Max Price per Hour (₹)"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <h3 className="text-xl font-semibold text-primaryBlue mb-4">Available Parking</h3>
            <div className="grid grid-cols-1 gap-6">
              {parkingSpots.length ? (
                parkingSpots.map(spot => (
                  <ParkingCard
                    key={spot._id}
                    parking={spot}
                    userLocation={searchLocation.lat ? searchLocation : userLocation}
                  />
                ))
              ) : (
                <p className="text-gray-600">No parking spots available.</p>
              )}
            </div>
          </div>
          <div className="md:w-1/2">
            {isLoaded && userLocation ? (
              <MapView
                parkingSpots={parkingSpots}
                userLocation={searchLocation.lat ? searchLocation : userLocation}
              />
            ) : (
              <p className="text-gray-600">Loading map...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParkingList;