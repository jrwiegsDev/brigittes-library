import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition">
              Brigitte's Library
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="hover:text-gray-300 transition px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/library"
              className="hover:text-gray-300 transition px-3 py-2 rounded-md text-sm font-medium"
            >
              Library
            </Link>
            <Link
              to="/about"
              className="hover:text-gray-300 transition px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-300">Welcome, {user.username}</span>
                <Link
                  to="/admin"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
