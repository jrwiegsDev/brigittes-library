import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasLoved, setHasLoved] = useState(false);
  const [loveCount, setLoveCount] = useState(0);

  useEffect(() => {
    fetchPost();
    // Check if user has already loved this post
    const lovedPosts = JSON.parse(localStorage.getItem('lovedPosts') || '[]');
    setHasLoved(lovedPosts.includes(slug));
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getBySlug(slug);
      setPost(response.data.data);
      setLoveCount(response.data.data.likes || 0);
      setError('');
    } catch (err) {
      setError('Post not found');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLove = async () => {
    if (hasLoved) return;
    
    try {
      const response = await postsAPI.like(post._id);
      setLoveCount(response.data.data.likes);
      setHasLoved(true);
      
      // Store in localStorage
      const lovedPosts = JSON.parse(localStorage.getItem('lovedPosts') || '[]');
      lovedPosts.push(slug);
      localStorage.setItem('lovedPosts', JSON.stringify(lovedPosts));
    } catch (err) {
      console.error('Error loving post:', err);
    }
  };

  const renderTipTapContent = (content) => {
    if (!content || !content.content) return null;

    return content.content.map((node, nodeIndex) => {
      switch (node.type) {
        case 'heading':
          const HeadingTag = `h${node.attrs?.level || 2}`;
          const headingClasses = {
            1: 'text-4xl font-bold mt-8 mb-4',
            2: 'text-3xl font-bold mt-6 mb-3',
            3: 'text-2xl font-bold mt-5 mb-2',
            4: 'text-xl font-bold mt-4 mb-2',
            5: 'text-lg font-bold mt-3 mb-2',
            6: 'text-base font-bold mt-2 mb-1'
          };
          return (
            <HeadingTag key={nodeIndex} className={headingClasses[node.attrs?.level || 2]}>
              {node.content?.map(c => c.text).join('')}
            </HeadingTag>
          );
        
        case 'paragraph':
          return (
            <p key={nodeIndex} className="mb-4 leading-relaxed">
              {node.content?.map((textNode, textIndex) => {
                let text = textNode.text || '';
                let element = <span key={textIndex}>{text}</span>;
                
                if (textNode.marks) {
                  textNode.marks.forEach(mark => {
                    switch (mark.type) {
                      case 'bold':
                        element = <strong key={textIndex}>{text}</strong>;
                        break;
                      case 'italic':
                        element = <em key={textIndex}>{text}</em>;
                        break;
                      case 'code':
                        element = <code key={textIndex} className="bg-gray-100 px-1 rounded">{text}</code>;
                        break;
                      case 'link':
                        element = (
                          <a
                            key={textIndex}
                            href={mark.attrs?.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:text-amber-800 underline"
                          >
                            {text}
                          </a>
                        );
                        break;
                    }
                  });
                }
                return element;
              })}
            </p>
          );
        
        case 'bulletList':
          return (
            <ul key={nodeIndex} className="list-disc list-inside mb-4 ml-4 space-y-2">
              {node.content?.map((listItem, liIndex) => (
                <li key={liIndex}>
                  {listItem.content?.[0]?.content?.map(c => c.text).join('')}
                </li>
              ))}
            </ul>
          );
        
        case 'orderedList':
          return (
            <ol key={nodeIndex} className="list-decimal list-inside mb-4 ml-4 space-y-2">
              {node.content?.map((listItem, liIndex) => (
                <li key={liIndex}>
                  {listItem.content?.[0]?.content?.map(c => c.text).join('')}
                </li>
              ))}
            </ol>
          );
        
        case 'blockquote':
          return (
            <blockquote key={nodeIndex} className="border-l-4 border-amber-500 pl-4 italic my-4 text-gray-700">
              {node.content?.map((p, pIndex) => (
                <p key={pIndex}>{p.content?.map(c => c.text).join('')}</p>
              ))}
            </blockquote>
          );
        
        case 'codeBlock':
          return (
            <pre key={nodeIndex} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
              <code>{node.content?.map(c => c.text).join('')}</code>
            </pre>
          );
        
        default:
          return null;
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/blog')}
          className="mb-6 text-amber-600 hover:text-amber-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </button>

        {/* Post Header */}
        <header className="bg-white rounded-t-lg shadow-lg p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between text-gray-600 mb-6">
            <div className="flex items-center space-x-4">
              <span>{formatDate(post.publishedAt)}</span>
              {post.author?.username && (
                <>
                  <span>•</span>
                  <span>By {post.author.username}</span>
                </>
              )}
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <div className="bg-white shadow-lg px-8 py-8 text-gray-800 text-lg">
          {renderTipTapContent(post.content)}
        </div>

        {/* Love Button */}
        <div className="bg-white rounded-b-lg shadow-lg p-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={handleLove}
              disabled={hasLoved}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                hasLoved
                  ? 'bg-red-100 text-red-700 cursor-not-allowed'
                  : 'bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400'
              }`}
            >
              <span className="text-2xl">{hasLoved ? '❤️' : '🤍'}</span>
              <span>{hasLoved ? 'Loved!' : 'Love this post'}</span>
            </button>
            
            <div className="text-gray-600">
              <span className="text-red-500 text-2xl mr-2">❤️</span>
              <span className="text-xl font-medium">{loveCount}</span>
              <span className="text-sm ml-1">love{loveCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
