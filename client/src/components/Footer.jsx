import { FaCar, FaEnvelope, FaPhone } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-primaryBlue text-backgroundWhite py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <FaCar className="h-8 w-8 text-primaryYellow" />
              <span className="ml-2 text-xl font-bold">VehicleCafe</span>
            </div>
            <p className="mt-2 text-sm">Your one-stop solution for renting private parking spaces.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primaryYellow">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/parking" className="hover:text-primaryRed">Find Parking</a></li>
              <li><a href="/dashboard" className="hover:text-primaryRed">Dashboard</a></li>
              <li><a href="/profile" className="hover:text-primaryRed">Profile</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primaryYellow">Contact Us</h3>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center">
                <FaEnvelope className="mr-2" /> support@vehiclecafe.com
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2" /> +1-800-VEHICLE
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          &copy; 2025 VehicleCafe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;