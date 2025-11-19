const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csv = require('csv-parser');
require('dotenv').config();

// Simple Book schema (matching your model)
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: String,
  publicationYear: Number,
  isbn: String,
  coverImage: String,
  brigittesRating: { type: Number, min: 0, max: 10 },
  brigittesNotes: String,
  tags: [String],
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Book = mongoose.model('Book', bookSchema);

async function importBooksFromCSV(csvFilePath, userId) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const books = [];
    
    // Read and parse CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          // Map CSV columns to book fields
          // Adjust these column names based on what's in Brigitte's export
          const book = {
            title: row.Title || row.title || '',
            author: row.Author || row.author || row.Creator || '',
            isbn: row.ISBN || row.isbn || row.ISBN13 || '',
            publicationYear: parseInt(row['Publication Year'] || row.Year || row.year) || null,
            genre: row.Genre || row.genre || row.Subject || '',
            brigittesRating: parseInt(row.Rating || row.rating) || null,
            brigittesNotes: row.Notes || row.notes || row.Review || '',
            tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
            addedBy: userId
          };

          // Only add if we have at least title and author
          if (book.title && book.author) {
            books.push(book);
          } else {
            console.log('Skipping invalid row:', row);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`\nParsed ${books.length} books from CSV`);
    
    if (books.length === 0) {
      console.log('No valid books found. Check CSV column names.');
      process.exit(1);
    }

    // Show first book as sample
    console.log('\nSample book (first entry):');
    console.log(JSON.stringify(books[0], null, 2));
    
    console.log('\nImporting books to database...');
    
    // Insert all books
    const result = await Book.insertMany(books, { ordered: false });
    
    console.log(`\n✅ Successfully imported ${result.length} books!`);
    
    // Show some stats
    const totalBooks = await Book.countDocuments();
    console.log(`Total books in database: ${totalBooks}`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing books:', error.message);
    process.exit(1);
  }
}

// Get CSV file path and user ID from command line
const csvPath = process.argv[2];
const userId = process.argv[3];

if (!csvPath) {
  console.error('Please provide CSV file path');
  console.log('Usage: node scripts/importBooks.js path/to/books.csv [userId]');
  console.log('Example: node scripts/importBooks.js ~/Downloads/library.csv 673a8f2e1b4c5d6e7f8g9h0i');
  process.exit(1);
}

if (!fs.existsSync(csvPath)) {
  console.error(`File not found: ${csvPath}`);
  process.exit(1);
}

importBooksFromCSV(csvPath, userId);
