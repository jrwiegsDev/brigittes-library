const OPEN_LIBRARY_API = 'https://openlibrary.org';

export const searchOpenLibrary = async (query) => {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&limit=10`
    );
    const data = await response.json();
    
    return data.docs.map(book => ({
      title: book.title,
      author: book.author_name?.[0] || 'Unknown Author',
      first_publish_year: book.first_publish_year,
      isbn: book.isbn?.[0],
      cover_url: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null
    }));
  } catch (error) {
    console.error('Error searching Open Library:', error);
    throw error;
  }
};

export const getBookByISBN = async (isbn) => {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_API}/isbn/${isbn}.json`
    );
    const data = await response.json();
    
    return {
      title: data.title,
      author: data.authors?.[0]?.name || 'Unknown Author',
      publish_date: data.publish_date,
      isbn: isbn,
      cover_url: data.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
        : null
    };
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    throw error;
  }
};
