import { useState, useMemo, useContext } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { GoogleMapsContext } from './GoogleMapsProvider.jsx';
import { FaParking } from 'react-icons/fa';

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

function MapView({ parkingSpots, userLocation }) {
  const { isLoaded } = useContext(GoogleMapsContext);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const center = useMemo(() => ({
    lat: parseFloat(userLocation.lat),
    lng: parseFloat(userLocation.lng)
  }), [userLocation]);

  if (!isLoaded || !userLocation) {
    return <div className="text-gray-600">Loading map...</div>;
  }

  // Debugging: Log the Map ID to ensure it is correctly loaded
  console.log('Map ID:', import.meta.env.VITE_GOOGLE_MAPS_MAP_ID);

  // SVG path for FaMapMarkerAlt from react-icons
  const userIconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
    </svg>
  `;

  const handleMapLoad = (map) => {
    // Create AdvancedMarkerElement for user location
    const userMarker = new google.maps.marker.AdvancedMarkerElement({
      position: center,
      map,
      title: 'Your Location',
      content: (() => {
        const div = document.createElement('div');
        div.innerHTML = userIconSvg;
        const svg = div.firstElementChild;
        svg.style.width = '40px';
        svg.style.height = '40px';
        svg.style.fill = '#3B82F6'; // primaryBlue
        return svg;
      })()
    });

    // Create AdvancedMarkerElement for parking spots
    const parkingMarkers = parkingSpots.map(spot => {
      if (spot.location?.coordinates) {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: {
            lat: spot.location.coordinates[1],
            lng: spot.location.coordinates[0]
          },
          map,
          title: spot.heading,
          content: (() => {
            const div = document.createElement('div');
            div.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <circle cx="256" cy="256" r="256" fill="#10B981" />
                <circle cx="256" cy="256" r="200" fill="none" stroke="#ffffff" stroke-width="40"/>
              </svg>
            `;
            const svg = div.firstElementChild;
            svg.style.width = '24px';
            svg.style.height = '24px';
            return svg;
          })()
        });

        // Add click listener for InfoWindow
        marker.addListener('click', () => setSelectedSpot(spot));
        return marker;
      }
      return null;
    });

    // Cleanup function
    return () => {
      userMarker.map = null;
      parkingMarkers.forEach(marker => marker && (marker.map = null));
    };
  };

  return (
    <div className="bg-backgroundWhite p-4 rounded-lg shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        options={{
          streetViewControl: false,
          mapTypeControl: false
        }}
        onLoad={handleMapLoad}
        mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID} // Required for AdvancedMarkerElement
      >
        {/* Info Window for Selected Spot */}
        {selectedSpot && (
          <InfoWindow
            position={{ lat: selectedSpot.location.coordinates[1], lng: selectedSpot.location.coordinates[0] }}
            onCloseClick={() => setSelectedSpot(null)}
          >
            <div className="p-2">
              <h3 className="text-primaryBlue font-semibold flex items-center">
                <FaParking className="mr-1" /> {selectedSpot.heading}
              </h3>
              <p className="text-gray-600">Address: {selectedSpot.address}</p>
              <p className="text-gray-600">Vehicle Type: {selectedSpot.vehicleType}</p>
              <p className="text-gray-600">Price: ₹{selectedSpot.pricePerHour}/hour</p>
              <p className="text-gray-600">Owner: {selectedSpot.owner?.username || 'Unknown'}</p>
              <p className="text-gray-600">Rating: {selectedSpot.owner?.ratings || 'N/A'}</p>
              <a
                href={`/parking/${selectedSpot._id}`}
                className="mt-2 inline-block bg-primaryGreen text-backgroundWhite px-3 py-1 rounded-lg hover:bg-primaryRed transition"
              >
                View Details
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default MapView;
