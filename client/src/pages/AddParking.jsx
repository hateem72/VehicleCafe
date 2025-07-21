
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { createParking } from '../utils/api.js';
import { FaMapMarkerAlt, FaCar, FaDollarSign, FaImage, FaInfoCircle } from 'react-icons/fa';

const libraries = ['places'];

function AddParking() {
  const [formData, setFormData] = useState({
    address: '',
    vehicleType: 'small',
    pricePerHour: '',
    description: '',
    useCurrentLocation: false,
    lat: '',
    lng: '',
    images: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  useEffect(() => {
    if (formData.useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
            address: formData.address || 'Current Location'
          });
          setErrors({ ...errors, location: '' });
        },
        () => {
          setFormData({
            ...formData,
            useCurrentLocation: false,
            lat: '37.7749',
            lng: '-122.4194',
            address: formData.address || 'San Francisco, CA'
          });
          setErrors({ ...errors, location: 'Geolocation access denied. Using default location (San Francisco).' });
        }
      );
    }
  }, [formData.useCurrentLocation]);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setFormData({
          ...formData,
          address: place.formatted_address,
          lat: place.geometry.location.lat().toString(),
          lng: place.geometry.location.lng().toString(),
          useCurrentLocation: false
        });
        setErrors({ ...errors, location: '' });
      } else {
        setErrors({ ...errors, location: 'Please select a valid address from the suggestions' });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.pricePerHour || formData.pricePerHour <= 0) {
      newErrors.pricePerHour = 'Price per hour must be a positive number';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.images.length > 3) newErrors.images = 'Maximum 3 images allowed';
    const latValue = parseFloat(formData.lat);
    const lngValue = parseFloat(formData.lng);
    if (!formData.lat || isNaN(latValue) || latValue < -90 || latValue > 90) {
      newErrors.location = 'Invalid location selected';
    }
    if (!formData.lng || isNaN(lngValue) || lngValue < -180 || lngValue > 180) {
      newErrors.location = 'Invalid location selected';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    if (e.target.name === 'images') {
      const files = Array.from(e.target.files).slice(0, 3);
      setFormData({ ...formData, images: files });
    } else if (e.target.name === 'useCurrentLocation') {
      setFormData({ ...formData, useCurrentLocation: e.target.checked, address: '' });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const data = new FormData();
      data.append('address', formData.address);
      data.append('vehicleType', formData.vehicleType);
      data.append('pricePerHour', formData.pricePerHour);
      data.append('description', formData.description);
      data.append('lat', parseFloat(formData.lat));
      data.append('lng', parseFloat(formData.lng));
      formData.images.forEach(image => data.append('images', image));

      console.log('Submitting form data:', Object.fromEntries(data));

      await createParking(data);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-backgroundWhite rounded-2xl shadow-xl transform transition-all hover:shadow-2xl">
      <h2 className="text-3xl font-extrabold text-primaryBlue mb-8 flex items-center justify-center">
        <FaMapMarkerAlt className="mr-3 text-primaryYellow" /> List Your Parking
      </h2>
      {errors.submit && <p className="text-primaryRed mb-6 text-center font-medium">{errors.submit}</p>}
      {errors.location && <p className="text-primaryRed mb-6 text-center font-medium">{errors.location}</p>}
      {loading && <p className="text-primaryBlue mb-6 text-center font-medium">Listing parking...</p>}
      <div className="space-y-6">
        <div>
          <label className="block text-primaryBlue font-semibold mb-2 flex items-center">
            <FaMapMarkerAlt className="mr-2" /> Use Current Location
          </label>
          <input
            type="checkbox"
            name="useCurrentLocation"
            checked={formData.useCurrentLocation}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-600">Use my current location</span>
        </div>
        {!formData.useCurrentLocation && isLoaded && (
          <div>
            <label className="block text-primaryBlue font-semibold mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Search Address
            </label>
            <Autocomplete
              onLoad={autocomplete => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter parking address"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow transition ${errors.address ? 'border-primaryRed' : 'border-gray-300'}`}
              />
            </Autocomplete>
            {errors.address && <p className="text-primaryRed text-sm mt-1">{errors.address}</p>}
          </div>
        )}
        {formData.useCurrentLocation && (
          <div>
            <label className="block text-primaryBlue font-semibold mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Address (Optional)
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address (optional for current location)"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow transition border-gray-300"
            />
          </div>
        )}
        <div>
          <label className="block text-primaryBlue font-semibold mb-2 flex items-center">
            <FaInfoCircle className="mr-2" /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your parking space (e.g., covered, secure, near downtown)"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow transition ${errors.description ? 'border-primaryRed' : 'border-gray-300'}`}
            rows="4"
          />
          {errors.description && <p className="text-primaryRed text-sm mt-1">{errors.description}</p>}
        </div>
        <div>
          <label className="block text-primaryBlue font-semibold mb-2 flex items-center">
            <FaCar className="mr-2" /> Vehicle Type
          </label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow transition"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label className="block text-primaryBlue font-semibold mb-2 flex items-center">
            <FaDollarSign className="mr-2" /> Price per Hour ($)
          </label>
          <input
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            placeholder="Enter price per hour"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow transition ${errors.pricePerHour ? 'border-primaryRed' : 'border-gray-300'}`}
          />
          {errors.pricePerHour && <p className="text-primaryRed text-sm mt-1">{errors.pricePerHour}</p>}
        </div>
        <div>
          <label className="block text-primaryBlue font-semibold mb-2 flex items-center">
            <FaImage className="mr-2" /> Images (up to 3)
          </label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primaryBlue file:text-backgroundWhite hover:file:bg-primaryRed transition"
          />
          {formData.images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {formData.images.map((img, index) => (
                <img key={index} src={URL.createObjectURL(img)} alt="Preview" className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          )}
          {errors.images && <p className="text-primaryRed text-sm mt-1">{errors.images}</p>}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !isLoaded}
          className="w-full p-4 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition disabled:opacity-50 flex items-center justify-center font-semibold text-lg"
        >
          <FaMapMarkerAlt className="mr-2" /> List Parking
        </button>
      </div>
    </div>
  );
}

export default AddParking;
