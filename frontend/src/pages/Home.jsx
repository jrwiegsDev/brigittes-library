import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { postsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await postsAPI.getAll({ limit: 3 });
        setRecentPosts(response.data.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-yellow-700 text-white py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Welcome to Brigitte's Library</h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 px-2">
            A personal collection of thoughts, stories, and over 1,700 beloved books
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-2">
            <Link
              to="/library"
              className="bg-white text-amber-900 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-amber-50 transition inline-block"
            >
              Visit the Library
            </Link>
            <Link
              to="/blog"
              className="bg-white text-amber-900 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-amber-50 transition inline-block"
            >
              Brigitte's Blog
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-white hover:text-amber-900 transition inline-block"
            >
              About Brigitte
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Library Section */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="bg-amber-100 p-2 sm:p-3 rounded-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 ml-3 sm:ml-4">Explore the Collection</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
              Browse through over 1,700 books, complete with personal ratings and notes from Brigitte
            </p>
            <div className="mb-4 sm:mb-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-200">
                  <p className="text-2xl sm:text-3xl font-bold text-amber-900">1,700+</p>
                  <p className="text-xs sm:text-sm text-amber-800">Books</p>
                </div>
                <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-900">50+</p>
                  <p className="text-xs sm:text-sm text-yellow-800">Genres</p>
                </div>
              </div>
            </div>
            <Link
              to="/library"
              className="w-full block text-center bg-amber-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-amber-700 transition"
            >
              Browse the Library
            </Link>
          </div>

          {/* Blog Posts Section */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 ml-3 sm:ml-4">Recent Posts</h2>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : recentPosts.length > 0 ? (
              <>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  {recentPosts.map((post) => (
                    <Link
                      key={post._id}
                      to={`/blog/${post.slug}`}
                      className="block border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 hover:border-purple-300 transition"
                    >
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{post.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs sm:text-sm text-purple-600 font-medium">
                          Read more →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/blog"
                  className="w-full block text-center bg-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-purple-700 transition"
                >
                  View All Posts
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-600 text-center py-6 sm:py-8 text-sm sm:text-base">No blog posts yet. Check back soon!</p>
                <Link
                  to="/blog"
                  className="w-full block text-center bg-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-purple-700 transition"
                >
                  View Blog
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
