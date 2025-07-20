import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createBooking, checkInOut } from '../utils/api.js';
import QRCodeGenerator from '../components/QRCodeGenerator.jsx';
import { FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';

function Booking() {
  const { parkingId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ startTime: '', duration: '' });
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createBooking({ parkingId, ...formData });
      setBooking(response);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInOut = async (status) => {
    if (!booking) return;
    setLoading(true);
    try {
      await checkInOut({ bookingId: booking._id, status });
      if (status === 'completed') {
        setBooking(null);
        navigate('/dashboard');
      } else {
        setBooking({ ...booking, status });
      }
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primaryBlue mb-6 flex items-center">
        <FaCalendarAlt className="mr-2" /> Book Parking
      </h2>
      {error && <p className="text-primaryRed mb-4">{error}</p>}
      {loading && <p className="text-primaryBlue mb-4">Processing...</p>}
      {!booking ? (
        <div className="space-y-4">
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
          />
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration (hours)"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full p-3 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition disabled:opacity-50"
          >
            <FaCalendarAlt className="inline mr-2" /> Book Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <QRCodeGenerator qrCodeData={booking.qrCode} />
          <p className="text-gray-600">Status: {booking.status}</p>
          <div className="flex space-x-4">
            {booking.status === 'pending' && (
              <button
                onClick={() => handleCheckInOut('active')}
                className="flex-1 p-3 bg-primaryYellow text-primaryBlue rounded-lg hover:bg-primaryRed hover:text-backgroundWhite transition"
              >
                <FaCheck className="inline mr-2" /> Check In
              </button>
            )}
            {booking.status === 'active' && (
              <button
                onClick={() => handleCheckInOut('completed')}
                className="flex-1 p-3 bg-primaryRed text-backgroundWhite rounded-lg hover:bg-primaryBlue transition"
              >
                <FaTimes className="inline mr-2" /> Check Out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;