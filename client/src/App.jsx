import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ParkingList from './pages/ParkingList.jsx';
import AddParking from './pages/AddParking.jsx';
import Booking from './pages/Booking.jsx';
import Profile from './pages/Profile.jsx';
import Chat from './pages/Chat.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <div className="min-h-screen bg-backgroundWhite">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/parking" element={<ParkingList />} />
        <Route path="/parking/new" element={<ProtectedRoute><AddParking /></ProtectedRoute>} />
        <Route path="/booking/:parkingId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;