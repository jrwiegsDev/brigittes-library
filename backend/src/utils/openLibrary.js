const axios = require('axios');

/**
 * Search Open Library API for books by title and/or author
 * @param {string} title - Book title
 * @param {string} author - Author name
 * @returns {Promise<Array>} Array of book results
 */
const searchOpenLibrary = async (title = '', author = '') => {
  try {
    const params = new URLSearchParams();
    
    if (title) params.append('title', title);
    if (author) params.append('author', author);
    
    if (!title && !author) {
      throw new Error('Please provide at least a title or author');
    }

    const response = await axios.get(`https://openlibrary.org/search.json?${params.toString()}`);
    
    if (!response.data || !response.data.docs) {
      return [];
    }

    // Format the results to match our needs
    const books = response.data.docs.slice(0, 10).map(book => ({
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown',
      publicationYear: book.first_publish_year || null,
      isbn: book.isbn ? book.isbn[0] : null,
      coverImage: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null,
      genre: book.subject ? book.subject.slice(0, 3).join(', ') : null,
      publisher: book.publisher ? book.publisher[0] : null,
      pageCount: book.number_of_pages_median || null
    }));

    return books;
  } catch (error) {
    console.error('Open Library API Error:', error.message);
    throw new Error('Failed to fetch book data from Open Library');
  }
};

/**
 * Get book details by ISBN
 * @param {string} isbn - ISBN-10 or ISBN-13
 * @returns {Promise<Object>} Book details
 */
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`);
    
    if (!response.data) {
      return null;
    }

    const book = response.data;
    
    return {
      title: book.title,
      author: book.authors ? 'See full details' : 'Unknown', // Authors are references, need additional API call
      publicationYear: book.publish_date ? parseInt(book.publish_date) : null,
      isbn: isbn,
      coverImage: book.covers && book.covers[0]
        ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
        : null,
      publisher: book.publishers ? book.publishers.join(', ') : null,
      pageCount: book.number_of_pages || null
    };
  } catch (error) {
    console.error('Open Library ISBN Error:', error.message);
    return null;
  }
};

module.exports = {
  searchOpenLibrary,
  getBookByISBN
};
