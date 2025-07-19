import { useState, useEffect } from 'react';
import { updateProfile, getCurrentUser } from '../utils/api.js';
import { FaStar, FaCheckCircle, FaUser, FaCar } from 'react-icons/fa';

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', vehicleNumber: '', password: '', profileImage: null });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response);
        setFormData({
          username: response.username || '',
          email: response.email || '',
          vehicleNumber: response.vehicleNumber || '',
          password: ''
        });
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'profileImage') {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) data.append(key, formData[key]);
      });
      const updatedUser = await updateProfile(data);
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-primaryBlue mb-6">Profile</h2>
      {error && <p className="text-primaryRed mb-4">{error}</p>}
      {success && <p className="text-primaryGreen mb-4">{success}</p>}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-primaryBlue mb-4 flex items-center">
              <FaUser className="mr-2" /> User Details
            </h3>
            <img
              src={user.profileImage?.url || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">Username: {user.username}</p>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Role: {user.role}</p>
            <p className="text-gray-600">Vehicle Number: {user.vehicleNumber || 'Not set'}</p>
            <div className="flex items-center mt-2">
              <FaStar className="text-primaryYellow mr-1" />
              <span>{user.ratings?.length ? (user.ratings.reduce((a, b) => a + b.rating, 0) / user.ratings.length).toFixed(1) : 'No ratings'}</span>
              {user.trustedParker && <FaCheckCircle className="ml-2 text-primaryGreen" title="Trusted Parker" />}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-primaryBlue mb-4">Update Profile</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
              />
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="Vehicle Number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
              />
              <input
                type="file"
                name="profileImage"
                onChange={handleChange}
                accept="image/*"
                className="w-full p-3 border rounded-lg"
              />
              <button
                onClick={handleSubmit}
                className="w-full p-3 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition"
              >
                Update Profile
              </button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2">
            <h3 className="text-xl font-semibold text-primaryBlue mb-4 flex items-center">
              <FaCar className="mr-2" /> Parking History
            </h3>
            {user.parkingHistory.length ? (
              <ul className="space-y-2">
                {user.parkingHistory.map((history, index) => (
                  <li key={index} className="text-gray-600">
                    Parked at {history.parkingId?.address || 'Unknown'} for {history.duration} hours on {new Date(history.time).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No parking history yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;