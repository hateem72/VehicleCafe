import { useState, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { FaParking, FaUser } from 'react-icons/fa';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

function MapView({ parkingSpots, userLocation }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [selectedSpot, setSelectedSpot] = useState(null);

  const center = useMemo(() => ({
    lat: userLocation.lat,
    lng: userLocation.lng,
  }), [userLocation]);

  if (!isLoaded) {
    return <div className="text-gray-600">Loading map...</div>;
  }

  return (
    <div className="bg-backgroundWhite p-4 rounded-lg shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* User Location Marker */}
        <Marker
          position={center}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#3B82F6', // primaryBlue
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 10,
          }}
          title="Your Location"
        />

        {/* Parking Spot Markers */}
        {Array.isArray(parkingSpots) && parkingSpots.map(spot => (
          <Marker
            key={spot._id}
            position={{ lat: spot.location.coordinates[1], lng: spot.location.coordinates[0] }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#10B981', // primaryGreen
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 8,
            }}
            onClick={() => setSelectedSpot(spot)}
          />
        ))}

        {/* Info Window for Selected Spot */}
        {selectedSpot && (
          <InfoWindow
            position={{ lat: selectedSpot.location.coordinates[1], lng: selectedSpot.location.coordinates[0] }}
            onCloseClick={() => setSelectedSpot(null)}
          >
            <div className="p-2">
              <h3 className="text-primaryBlue font-semibold flex items-center">
                <FaParking className="mr-1" /> {selectedSpot.address}
              </h3>
              <p className="text-gray-600">Vehicle Type: {selectedSpot.vehicleType}</p>
              <p className="text-gray-600">Price: ${selectedSpot.pricePerHour}/hour</p>
              <p className="text-gray-600">Owner: {selectedSpot.owner?.username || 'Unknown'}</p>
              <p className="text-gray-600">Rating: {selectedSpot.owner?.ratings || 'N/A'}</p>
              <a
                href={`/booking/${selectedSpot._id}`}
                className="mt-2 inline-block bg-primaryGreen text-backgroundWhite px-3 py-1 rounded-lg hover:bg-primaryRed transition"
              >
                Book Now
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default MapView;