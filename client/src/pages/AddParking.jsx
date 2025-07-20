import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createParking } from '../utils/api.js';
import { FaMapMarkerAlt, FaCar, FaDollarSign, FaImage } from 'react-icons/fa';

function AddParking() {
  const [formData, setFormData] = useState({
    address: '',
    vehicleType: 'small',
    pricePerHour: '',
    lat: '',
    lng: '',
    images: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.pricePerHour || formData.pricePerHour <= 0) {
      newErrors.pricePerHour = 'Price per hour must be a positive number';
    }
    const latValue = parseFloat(formData.lat);
    const lngValue = parseFloat(formData.lng);
    if (!formData.lat || isNaN(latValue) || latValue < -90 || latValue > 90) {
      newErrors.lat = 'Latitude must be a number between -90 and 90';
    }
    if (!formData.lng || isNaN(lngValue) || lngValue < -180 || lngValue > 180) {
      newErrors.lng = 'Longitude must be a number between -180 and 180';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    if (e.target.name === 'images') {
      setFormData({ ...formData, images: Array.from(e.target.files) });
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
      data.append('lat', parseFloat(formData.lat));
      data.append('lng', parseFloat(formData.lng));
      formData.images.forEach(image => data.append('images', image));

      console.log('Submitting form data:', Object.fromEntries(data)); // Debug log

      await createParking(data);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-backgroundWhite rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primaryBlue mb-6 flex items-center">
        <FaMapMarkerAlt className="mr-2" /> List New Parking
      </h2>
      {errors.submit && <p className="text-primaryRed mb-4">{errors.submit}</p>}
      {loading && <p className="text-primaryBlue mb-4">Listing parking...</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-primaryBlue mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter parking address"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow ${errors.address ? 'border-primaryRed' : ''}`}
          />
          {errors.address && <p className="text-primaryRed text-sm">{errors.address}</p>}
        </div>
        <div>
          <label className="block text-primaryBlue mb-1">Vehicle Type</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label className="block text-primaryBlue mb-1">Price per Hour ($)</label>
          <input
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            placeholder="Enter price per hour"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow ${errors.pricePerHour ? 'border-primaryRed' : ''}`}
          />
          {errors.pricePerHour && <p className="text-primaryRed text-sm">{errors.pricePerHour}</p>}
        </div>
        <div>
          <label className="block text-primaryBlue mb-1">Latitude</label>
          <input
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            placeholder="Enter latitude (e.g., 37.7749)"
            step="any"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow ${errors.lat ? 'border-primaryRed' : ''}`}
          />
          {errors.lat && <p className="text-primaryRed text-sm">{errors.lat}</p>}
        </div>
        <div>
          <label className="block text-primaryBlue mb-1">Longitude</label>
          <input
            type="number"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            placeholder="Enter longitude (e.g., -122.4194)"
            step="any"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow ${errors.lng ? 'border-primaryRed' : ''}`}
          />
          {errors.lng && <p className="text-primaryRed text-sm">{errors.lng}</p>}
        </div>
        <div>
          <label className="block text-primaryBlue mb-1">Images</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full p-3 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition disabled:opacity-50 flex items-center justify-center"
        >
          <FaDollarSign className="mr-2" /> List Parking
        </button>
      </div>
    </div>
  );
}

export default AddParking;