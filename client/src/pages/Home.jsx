import { Link } from 'react-router-dom';
import { FaParking, FaSearch, FaStar } from 'react-icons/fa';

function Home() {
  return (
    <div className="bg-backgroundWhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primaryBlue mb-4">Welcome to VehicleCafe</h1>
          <p className="text-xl text-gray-600 mb-8">Rent private parking spaces with ease and convenience.</p>
          <Link to="/parking" className="inline-flex items-center px-6 py-3 bg-primaryYellow text-primaryBlue font-semibold rounded-lg hover:bg-primaryRed hover:text-backgroundWhite transition">
            <FaSearch className="mr-2" /> Find Parking Now
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaParking className="h-12 w-12 text-primaryGreen mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primaryBlue">Easy Booking</h3>
            <p className="text-gray-600">Book parking spaces in just a few clicks.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaSearch className="h-12 w-12 text-primaryRed mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primaryBlue">Smart Search</h3>
            <p className="text-gray-600">Find the perfect spot based on your needs.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaStar className="h-12 w-12 text-primaryYellow mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primaryBlue">Trusted Community</h3>
            <p className="text-gray-600">Connect with verified renters and owners.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;