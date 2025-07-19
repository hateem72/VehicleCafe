import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createBooking } from '../utils/api.js';
import QRCodeGenerator from '../components/QRCodeGenerator.jsx';
import { FaCalendarAlt } from 'react-icons/fa';

function Booking() {
  const { parkingId } = useParams();
  const [formData, setFormData] = useState({ startTime: '', duration: '' });
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createBooking({ parkingId, ...formData });
      setBooking(response);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primaryBlue mb-6">Book Parking</h2>
      {error && <p className="text-primaryRed mb-4">{error}</p>}
      {!booking ? (
        <div className="space-y-4">
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration (hours)"
            className="w-full p-3 border rounded-lg"
          />
          <button
            onClick={handleSubmit}
            className="w-full p-3 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition"
          >
            <FaCalendarAlt className="inline mr-2" /> Book Now
          </button>
        </div>
      ) : (
        <QRCodeGenerator qrCodeData={booking.qrCode} />
      )}
    </div>
  );
}

export default Booking;