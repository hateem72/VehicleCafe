import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCar, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { logoutUser } from '../utils/api.js';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('accessToken');

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <nav className="bg-primaryYellow shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaCar className="h-8 w-8 text-primaryBlue" />
              <span className="ml-2 text-2xl font-bold text-primaryBlue">VehicleCafe</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link to="/parking" className="px-3 py-2 text-primaryBlue hover:text-primaryRed">Find Parking</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-primaryBlue hover:text-primaryRed">Dashboard</Link>
                <Link to="/profile" className="px-3 py-2 text-primaryBlue hover:text-primaryRed">Profile</Link>
                <Link to="/chat" className="px-3 py-2 text-primaryBlue hover:text-primaryRed">Chat</Link>
                <button onClick={handleLogout} className="px-3 py-2 text-primaryBlue hover:text-primaryRed">
                  <FaSignOutAlt className="inline mr-1" /> Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="px-3 py-2 text-primaryBlue hover:text-primaryRed">Login</Link>
                <Link to="/register" className="px-3 py-2 text-primaryBlue hover:text-primaryRed">Register</Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 text-primaryBlue">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/parking" className="block px-3 py-2 text-primaryBlue hover:text-primaryRed">Find Parking</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-primaryBlue hover:text-primaryRed">Dashboard</Link>
                <Link to="/profile" className="block px-3 py-2 text-primaryBlue hover:text-primaryRed">Profile</Link>
                <Link to="/chat" className="block px-3 py-2 text-primaryBlue hover:text-primaryRed">Chat</Link>
                <button onClick={handleLogout} className="block px-3 py-2 text-primaryBlue hover:text-primaryRed">
                  <FaSignOutAlt className="inline mr-1" /> Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="block px-3 py-2 text-primaryBlue hover:text-primaryRed">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-primaryBlue hover:text-primaryRed">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;