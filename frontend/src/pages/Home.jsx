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
      <div className="bg-gradient-to-r from-amber-600 to-yellow-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Brigitte's Library</h1>
          <p className="text-xl mb-8">
            A personal collection of thoughts, stories, and over 1,000 beloved books
          </p>
          <div className="space-x-4">
            <Link
              to="/library"
              className="bg-white text-amber-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition inline-block"
            >
              Explore the Library
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-900 transition inline-block"
            >
              About Brigitte
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Blog Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Posts</h2>

        {loading ? (
          <LoadingSpinner />
        ) : recentPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No blog posts yet. Check back soon!</p>
        )}

        <div className="text-center mt-12">
          <Link
            to="/"
            className="text-amber-600 hover:text-amber-700 font-semibold text-lg"
          >
            View all posts →
          </Link>
        </div>
      </div>

      {/* Library Teaser Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore the Collection</h2>
          <p className="text-lg text-gray-700 mb-8">
            Browse through over 1,000 books, complete with personal ratings and notes from Brigitte
          </p>
          <Link
            to="/library"
            className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition inline-block"
          >
            Browse the Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
