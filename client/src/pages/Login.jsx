import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api.js';
import { FaSignInAlt } from 'react-icons/fa';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      localStorage.setItem('accessToken', response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primaryBlue mb-6">Login</h2>
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
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
        />
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-primaryYellow text-primaryBlue font-semibold rounded-lg hover:bg-primaryRed hover:text-backgroundWhite transition"
        >
          <FaSignInAlt className="inline mr-2" /> Login
        </button>
      </div>
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/register" className="text-primaryBlue hover:text-primaryRed">Register</Link>
      </p>
    </div>
  );
}

export default Login;