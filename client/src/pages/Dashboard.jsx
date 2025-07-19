import { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/api.js';
import { FaCar, FaMoneyBill, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  const handleSurgePricing = async (parkingId, surgeMultiplier) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/parking/surge`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ parkingId, surgeMultiplier })
      });
      alert('Surge pricing updated!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-primaryBlue mb-6">Dashboard</h2>
      {error && <p className="text-primaryRed mb-4">{error}</p>}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-primaryBlue mb-4 flex items-center">
              <FaCar className="mr-2" /> My Parking Spots
            </h3>
            {user.role === 'owner' ? (
              <div>
                <Link
                  to="/parking/new"
                  className="inline-block px-4 py-2 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition mb-4"
                >
                  Add New Parking
                </Link>
                {/* Example parking spots */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-600">123 Main St</p>
                    <p className="text-gray-600">Price: $5/hour</p>
                    <input
                      type="number"
                      placeholder="Surge Multiplier (e.g., 1.5)"
                      className="p-2 border rounded-lg mr-2"
                      onChange={(e) => handleSurgePricing('example-parking-id', e.target.value)}
                    />
                    <button className="px-4 py-2 bg-primaryYellow text-primaryBlue rounded-lg hover:bg-primaryRed hover:text-backgroundWhite">
                      Update Price
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Switch to owner role to manage parking spots.</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-primaryBlue mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Recent Bookings
            </h3>
            {user.parkingHistory.length ? (
              <ul className="space-y-2">
                {user.parkingHistory.map((history, index) => (
                  <li key={index} className="text-gray-600">
                    Parked at {history.parkingId?.address || 'Unknown'} for {history.duration} hours
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No recent bookings.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;