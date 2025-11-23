import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  return (
    <nav className="bg-stone-800 text-amber-50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-center items-center h-14 sm:h-16">
          {/* Navigation Links */}
          <div className="flex space-x-2 sm:space-x-4 md:space-x-8">
            <Link
              to="/"
              className="hover:text-yellow-400 transition px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/library"
              className="hover:text-yellow-400 transition px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium"
            >
              Library
            </Link>
            <Link
              to="/blog"
              className="hover:text-yellow-400 transition px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium"
            >
              Blog
            </Link>
            <Link
              to="/about"
              className="hover:text-yellow-400 transition px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
