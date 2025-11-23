import { useState, useEffect } from 'react';
import { postsAPI } from '../../services/api';
import TipTapEditor from '../../components/blog/TipTapEditor';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: null,
    excerpt: '',
    topic: 'General',
    tags: '',
    status: 'draft',
    isPreviousPost: false,
    customDate: ''
  });

  const topics = ['Books', 'Family', 'Career', 'Life', 'Movies', 'TV Shows', 'General', 'Headaches'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllAdmin({ limit: 100 });
      setPosts(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        status: formData.status
      };
      
      // If it's a previous post with custom date, add publishedAt
      if (formData.isPreviousPost && formData.customDate) {
        postData.publishedAt = new Date(formData.customDate).toISOString();
      }

      await postsAPI.create(postData);
      setShowAddModal(false);
      resetForm();
      fetchPosts();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to create post');
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        topic: formData.topic,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        status: formData.status
      };
      
      // If it's a previous post with custom date, add publishedAt
      if (formData.isPreviousPost && formData.customDate) {
        postData.publishedAt = new Date(formData.customDate).toISOString();
      }

      await postsAPI.update(selectedPost._id, postData);
      setShowEditModal(false);
      setSelectedPost(null);
      resetForm();
      fetchPosts();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to update post');
    }
  };

  const handleDeletePost = async () => {
    try {
      await postsAPI.delete(selectedPost._id);
      setShowDeleteModal(false);
      setSelectedPost(null);
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post');
    }
  };

  const handlePublishPost = async (post) => {
    try {
      const postData = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || undefined,
        topic: post.topic || 'General',
        tags: post.tags || [],
        status: 'published'
      };
      
      // If the post doesn't have a publishedAt date, set it to now
      if (!post.publishedAt) {
        postData.publishedAt = new Date().toISOString();
      }

      await postsAPI.update(post._id, postData);
      fetchPosts();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish post');
    }
  };

  const openEditModal = (post) => {
    setSelectedPost(post);
    // Check if post has a publishedAt date (could be from previous post or regular publish)
    const hasPublishedDate = !!post.publishedAt;
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      topic: post.topic || 'General',
      tags: post.tags ? post.tags.join(', ') : '',
      status: post.status,
      isPreviousPost: hasPublishedDate,
      customDate: hasPublishedDate ? new Date(post.publishedAt).toISOString().split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: null,
      excerpt: '',
      topic: 'General',
      tags: '',
      status: 'draft',
      isPreviousPost: false,
      customDate: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExcerpt = (post) => {
    if (post.excerpt) return post.excerpt;
    if (post.content?.content) {
      const text = post.content.content
        .map(node => node.content?.map(n => n.text).join(' '))
        .join(' ');
      return text.substring(0, 100) + '...';
    }
    return 'No content';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-2 text-sm text-gray-700">Manage your blog posts and articles</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => { setShowAddModal(true); resetForm(); }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Two Column Layout for Draft and Published Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Draft Posts Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Draft Posts</h2>
            <p className="text-sm text-gray-600">Posts you're working on - only visible to you</p>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {posts.filter(post => post.status === 'draft').length === 0 ? (
                <li className="px-6 py-12 text-center text-gray-500">
                  No draft posts. Create a new post to get started!
                </li>
              ) : (
                posts.filter(post => post.status === 'draft').map((post) => (
                  <li key={post._id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          draft
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {getExcerpt(post)}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>Created: {formatDate(post.createdAt)}</span>
                        {post.tags && post.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{post.tags.join(', ')}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePublishPost(post)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Publish
                        </button>
                        <button
                          onClick={() => openEditModal(post)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(post)}
                          className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Published Posts Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Published Posts</h2>
            <p className="text-sm text-gray-600">Posts visible to the public on your blog</p>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {posts.filter(post => post.status === 'published').length === 0 ? (
                <li className="px-6 py-12 text-center text-gray-500">
                  No published posts yet. Publish a draft to share it with the world!
                </li>
              ) : (
                posts.filter(post => post.status === 'published').map((post) => (
                  <li key={post._id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          published
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {getExcerpt(post)}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        {post.publishedAt && (
                          <span>Published: {formatDate(post.publishedAt)}</span>
                        )}
                        <span>•</span>
                        <span className="flex items-center">
                          <span className="text-red-500 mr-1">❤️</span>
                          {post.likes || 0}
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{post.tags.join(', ')}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(post)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(post)}
                          className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Add Post Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <form onSubmit={handleAddPost}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Post</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                      <TipTapEditor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        placeholder="Write your blog post here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Excerpt (Short Summary)</label>
                      <textarea
                        rows="2"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Brief summary for post previews..."
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Topic *</label>
                      <select
                        required
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      >
                        {topics.map((topic) => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="books, reading, fantasy"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="isPreviousPost-add"
                          checked={formData.isPreviousPost}
                          onChange={(e) => setFormData({ ...formData, isPreviousPost: e.target.checked, customDate: e.target.checked ? formData.customDate : '' })}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isPreviousPost-add" className="ml-2 block text-sm font-medium text-gray-700">
                          Previous Post? (Set a custom date from the past)
                        </label>
                      </div>
                      
                      {formData.isPreviousPost && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Post Date *</label>
                          <input
                            type="date"
                            required={formData.isPreviousPost}
                            value={formData.customDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Select the date when this post was originally written
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create Post
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal - Similar to Add but with edit handler */}
      {showEditModal && selectedPost && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <form onSubmit={handleEditPost}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Post</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                      <TipTapEditor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        placeholder="Write your blog post here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Excerpt (Short Summary)</label>
                      <textarea
                        rows="2"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Brief summary for post previews..."
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Topic *</label>
                      <select
                        required
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      >
                        {topics.map((topic) => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="books, reading, fantasy"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="isPreviousPost-edit"
                          checked={formData.isPreviousPost}
                          onChange={(e) => setFormData({ ...formData, isPreviousPost: e.target.checked, customDate: e.target.checked ? formData.customDate : '' })}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isPreviousPost-edit" className="ml-2 block text-sm font-medium text-gray-700">
                          Previous Post? (Set a custom date from the past)
                        </label>
                      </div>
                      
                      {formData.isPreviousPost && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Post Date *</label>
                          <input
                            type="date"
                            required={formData.isPreviousPost}
                            value={formData.customDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Select the date when this post was originally written
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowEditModal(false); setSelectedPost(null); resetForm(); }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPost && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Post</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{selectedPost.title}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleDeletePost}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => { setShowDeleteModal(false); setSelectedPost(null); }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
