import { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      setBooks(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load library. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique genres for filter
  const genres = [...new Set(books.filter(book => book.genre).map(book => book.genre))].sort();

  // Filter books based on search and genre
  const filteredBooks = books.filter(book => {
    const matchesSearch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Brigitte's Library</h1>
          <p className="text-gray-600">Explore a collection of {books.length} amazing books</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-xl text-gray-600">No books found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredBooks.length} of {books.length} books
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  onClick={() => setSelectedBook(book)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105 duration-200"
                >
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <svg className="h-20 w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                    
                    {book.genre && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                        {book.genre}
                      </span>
                    )}
                    
                    {book.brigittesRating && (
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm font-medium text-gray-700">
                          {book.brigittesRating}/10
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Book Detail Modal */}
        {selectedBook && (
          <div className="fixed z-50 inset-0 overflow-y-auto" onClick={() => setSelectedBook(null)}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full" onClick={(e) => e.stopPropagation()}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    {selectedBook.coverImage && (
                      <img
                        src={selectedBook.coverImage}
                        alt={selectedBook.title}
                        className="w-32 h-48 object-cover rounded-lg shadow-md mb-4 sm:mb-0 sm:mr-6"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2">
                        {selectedBook.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-4">{selectedBook.author}</p>
                      
                      <div className="space-y-3">
                        {selectedBook.genre && (
                          <div>
                            <span className="font-medium text-gray-700">Genre: </span>
                            <span className="text-gray-600">{selectedBook.genre}</span>
                          </div>
                        )}
                        
                        {selectedBook.publicationYear && (
                          <div>
                            <span className="font-medium text-gray-700">Published: </span>
                            <span className="text-gray-600">{selectedBook.publicationYear}</span>
                          </div>
                        )}
                        
                        {selectedBook.isbn && (
                          <div>
                            <span className="font-medium text-gray-700">ISBN: </span>
                            <span className="text-gray-600">{selectedBook.isbn}</span>
                          </div>
                        )}
                        
                        {selectedBook.brigittesRating && (
                          <div>
                            <span className="font-medium text-gray-700">Brigitte's Rating: </span>
                            <span className="text-yellow-500">★</span>
                            <span className="text-gray-900 font-semibold ml-1">
                              {selectedBook.brigittesRating}/10
                            </span>
                          </div>
                        )}
                        
                        {selectedBook.brigittesNotes && (
                          <div>
                            <span className="font-medium text-gray-700 block mb-1">Brigitte's Notes:</span>
                            <p className="text-gray-600 italic bg-gray-50 p-3 rounded">
                              "{selectedBook.brigittesNotes}"
                            </p>
                          </div>
                        )}
                        
                        {selectedBook.tags && selectedBook.tags.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-700 block mb-2">Tags:</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedBook.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setSelectedBook(null)}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
