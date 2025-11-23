import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          {/* Auth Section */}
          <div className="mb-6">
            {isAuthenticated ? (
              <div className="flex flex-wrap justify-center items-center gap-3">
                <span className="text-sm text-gray-300">Welcome, {user.username}</span>
                <Link
                  to="/admin"
                  className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-block bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-md text-sm font-medium transition"
              >
                Admin Login
              </Link>
            )}
          </div>

          <p className="text-gray-400">
            © {new Date().getFullYear()} Brigitte's Library. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built with ❤️ for book lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
