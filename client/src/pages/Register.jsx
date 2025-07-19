import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api.js';
import { FaUserPlus } from 'react-icons/fa';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'renter' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primaryBlue mb-6">Register</h2>
      {error && <p className="text-primaryRed mb-4">{error}</p>}
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
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
        >
          <option value="renter">Renter</option>
          <option value="owner">Owner</option>
        </select>
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-primaryYellow text-primaryBlue font-semibold rounded-lg hover:bg-primaryRed hover:text-backgroundWhite transition"
        >
          <FaUserPlus className="inline mr-2" /> Register
        </button>
      </div>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-primaryBlue hover:text-primaryRed">Login</Link>
      </p>
    </div>
  );
}

export default Register;