import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, isSuperAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {user?.username}!</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Manage Books Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
              <div className="bg-amber-50 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-amber-900"
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
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Library Management</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Add, edit, and organize your book collection. Search for books using the Open Library API.
            </p>
            <Link
              to="/admin/books"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition inline-block"
            >
              Manage Books
            </Link>
          </div>

          {/* Manage Blog Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-purple-600"
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
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Blog Management</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Create, edit, and publish blog posts. Manage drafts and published content.
            </p>
            <Link
              to="/admin/posts"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition inline-block"
            >
              Manage Posts
            </Link>
          </div>

          {/* User Management Card - Super Admin Only */}
          {isSuperAdmin && (
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                <h2 className="text-2xl font-bold text-gray-900 ml-4">User Management</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Add, edit, and manage admin users. Reset passwords and control access.
              </p>
              <Link
                to="/admin/users"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition inline-block"
              >
                Manage Users
              </Link>
            </div>
          )}
        </div>

        {/* Stats Coming Soon */}
        <div className="mt-8 bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h3>
          <p className="text-gray-600">Analytics and insights coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
