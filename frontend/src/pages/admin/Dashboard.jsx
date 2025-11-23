import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { statsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {user?.username}!</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Manage Books Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-3">
              <div className="bg-amber-50 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-amber-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 ml-3">Library Management</h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Add, edit, and organize your book collection. Search for books using the Open Library API.
            </p>
            <Link
              to="/admin/books"
              className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition inline-block text-sm"
            >
              Manage Books
            </Link>
          </div>

          {/* Manage Blog Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 ml-3">Blog Management</h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Create, edit, and publish blog posts. Manage drafts and published content.
            </p>
            <Link
              to="/admin/posts"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition inline-block text-sm"
            >
              Manage Posts
            </Link>
          </div>

          {/* User Management Card - Super Admin Only */}
          {isSuperAdmin && (
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 ml-3">User Management</h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Add, edit, and manage admin users. Reset passwords and control access.
              </p>
              <Link
                to="/admin/users"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition inline-block text-sm"
              >
                Manage Users
              </Link>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Statistics</h3>
          
          {loading ? (
            <LoadingSpinner />
          ) : stats ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Books */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-amber-900">Total Books</span>
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-amber-900">{stats.books.total}</p>
                <p className="text-xs text-amber-700 mt-1">{stats.books.rated} rated</p>
              </div>

              {/* Average Rating */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-900">Avg Rating</span>
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-yellow-900">{stats.books.avgRating}</p>
                <p className="text-xs text-yellow-700 mt-1">out of 10</p>
              </div>

              {/* Published Posts */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">Published Posts</span>
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-purple-900">{stats.posts.total}</p>
                <p className="text-xs text-purple-700 mt-1">{stats.posts.drafts} drafts</p>
              </div>

              {/* Total Loves */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-900">Total Loves</span>
                  <span className="text-xl">❤️</span>
                </div>
                <p className="text-3xl font-bold text-red-900">{stats.posts.totalLikes}</p>
                <p className="text-xs text-red-700 mt-1">across all posts</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Unable to load statistics</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
