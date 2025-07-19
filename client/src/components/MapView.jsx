import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

function MapView({ parkingSpots, userLocation }) {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation}
        zoom={14}
      >
        <Marker position={userLocation} label="You" />
        {parkingSpots.map(spot => (
          <Marker
            key={spot._id}
            position={{ lat: spot.location.coordinates[1], lng: spot.location.coordinates[0] }}
            label={`$${spot.pricePerHour * spot.surgeMultiplier}`}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapView;