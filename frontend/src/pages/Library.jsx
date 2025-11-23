import { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(24);
  const [selectedBook, setSelectedBook] = useState(null);

  // Helper function to get cover image URL from ISBN
  const getCoverImageUrl = (book) => {
    if (book.coverImage) return book.coverImage;
    if (book.isbn) {
      return `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
    }
    return null;
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterGenre, filterStatus, filterRating]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll({ limit: 2000 });
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
    const matchesStatus = !filterStatus || book.status === filterStatus;
    const matchesRating = !filterRating || (
      filterRating === '8+' ? (book.brigittesRating >= 8) :
      filterRating === '5-7' ? (book.brigittesRating >= 5 && book.brigittesRating < 8) :
      filterRating === '0-4' ? (book.brigittesRating < 5) :
      filterRating === 'unrated' ? (!book.brigittesRating) : true
    );
    return matchesSearch && matchesGenre && matchesStatus && matchesRating;
  }).sort((a, b) => a.title.localeCompare(b.title)); // Sort A-Z by title

  // Pagination calculations
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Reading Status</option>
              <option value="read">Read</option>
              <option value="currently-reading">Currently Reading</option>
              <option value="want-to-read">Want to Read</option>
            </select>
          </div>
          <div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Ratings</option>
              <option value="8+">⭐ 8+ (Excellent)</option>
              <option value="5-7">⭐ 5-7 (Good)</option>
              <option value="0-4">⭐ 0-4 (Fair)</option>
              <option value="unrated">Unrated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
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
              Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)} of {filteredBooks.length} books
              {filteredBooks.length !== books.length && ` (filtered from ${books.length} total)`}
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentBooks.map((book) => {
                const coverUrl = getCoverImageUrl(book);
                return (
                  <div
                    key={book._id}
                    onClick={() => setSelectedBook(book)}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105 duration-200"
                  >
                    <div className="relative w-full h-64 bg-gradient-to-br from-amber-100 to-yellow-100">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center" style={{ display: coverUrl ? 'none' : 'flex' }}>
                        <span className="text-8xl">📚</span>
                      </div>
                    </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                    
                    {book.genre && (
                      <span className="inline-block bg-amber-50 text-amber-900 text-xs px-2 py-1 rounded mb-2">
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
                );
              })}
            </div>

            {/* Pagination Controls */}
            {filteredBooks.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8 mb-8">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 3 ||
                      pageNumber === currentPage + 3
                    ) {
                      return <span key={pageNumber} className="px-2 py-2 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Book Detail Modal */}
        {selectedBook && (
          <div className="fixed z-50 inset-0 overflow-y-auto" onClick={() => setSelectedBook(null)}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-amber-600 to-yellow-700 px-6 py-4">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedBook.title}
                  </h3>
                  <p className="text-lg text-amber-50 mt-1">by {selectedBook.author}</p>
                </div>
                
                <div className="bg-white px-6 py-6">
                  <div className="sm:flex sm:gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative w-48 h-72 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg shadow-lg overflow-hidden mb-4 sm:mb-0">
                        {getCoverImageUrl(selectedBook) ? (
                          <img
                            src={getCoverImageUrl(selectedBook)}
                            alt={selectedBook.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { 
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="absolute inset-0 flex items-center justify-center" style={{ display: getCoverImageUrl(selectedBook) ? 'none' : 'flex' }}>
                          <span className="text-9xl">📚</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedBook.genre && (
                          <div className="bg-amber-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-1">Genre</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedBook.genre}</p>
                          </div>
                        )}
                        
                        {selectedBook.publicationYear && (
                          <div className="bg-amber-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-1">Published</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedBook.publicationYear}</p>
                          </div>
                        )}
                        
                        {selectedBook.pageCount && (
                          <div className="bg-amber-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-1">Pages</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedBook.pageCount}</p>
                          </div>
                        )}
                        
                        {selectedBook.isbn && (
                          <div className="bg-amber-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-1">ISBN</p>
                            <p className="text-sm text-gray-800 font-medium">{selectedBook.isbn}</p>
                          </div>
                        )}
                      </div>
                      
                      {selectedBook.brigittesRating && (
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border-2 border-yellow-400">
                          <p className="text-sm font-semibold text-amber-900 uppercase tracking-wide mb-2">Brigitte's Rating</p>
                          <div className="flex items-center">
                            <span className="text-3xl text-yellow-500 mr-2">★</span>
                            <span className="text-3xl font-bold text-gray-900">
                              {selectedBook.brigittesRating}<span className="text-xl text-gray-600">/10</span>
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {selectedBook.status && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Reading Status</p>
                          <p className="text-sm text-gray-800 font-medium capitalize">
                            {selectedBook.status.replace(/-/g, ' ')}
                          </p>
                        </div>
                      )}
                      
                      {selectedBook.brigittesNotes && (
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                          <p className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">Brigitte's Notes</p>
                          <p className="text-gray-700 italic leading-relaxed">
                            "{selectedBook.brigittesNotes}"
                          </p>
                        </div>
                      )}
                      
                      {selectedBook.tags && selectedBook.tags.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedBook.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-300"
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
                <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setSelectedBook(null)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-3 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
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
