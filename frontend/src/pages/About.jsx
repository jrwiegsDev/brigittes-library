const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Brigitte's Library</h1>
          
          <div className="prose prose-lg text-gray-700 space-y-6">
            <p>
              Welcome to my personal library and blog! I'm Brigitte, a lifelong reader and lover of all things literary.
            </p>
            
            <p>
              This space is a collection of my thoughts, reflections, and my ever-growing library of over 1,000 books.
              From classic literature to contemporary fiction, poetry to non-fiction, you'll find a diverse range of titles that have shaped my journey as a reader and writer.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What You'll Find Here</h2>
            
            <ul className="list-disc list-inside space-y-2">
              <li>Personal reflections and blog posts about reading, writing, and life</li>
              <li>A searchable catalog of my entire book collection</li>
              <li>My personal ratings and notes on each book</li>
              <li>Recommendations and favorite reads</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Support My Work</h2>
            
            <p>
              If you enjoy my writing and want to support my work, a "Buy Me a Coffee" option will be available soon!
              Your support helps me continue creating content and growing this literary community.
            </p>
            
            <p className="text-gray-600 italic mt-8">
              Thank you for visiting, and happy reading!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
