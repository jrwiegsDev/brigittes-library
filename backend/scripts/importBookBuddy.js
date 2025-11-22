const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Book = require('../src/models/Book');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Map CSV columns to our Book model
const mapBookBuddyToBook = (row, addedById) => {
  // Convert rating from 0-5 scale to 0-10 scale
  const originalRating = parseFloat(row.Rating) || 0;
  const brigittesRating = originalRating ? originalRating * 2 : null;

  // Combine Title and Subtitle if subtitle exists
  const fullTitle = row.Subtitle && row.Subtitle.trim()
    ? `${row.Title}: ${row.Subtitle}`.trim()
    : row.Title;

  // Parse date started and finished - only if valid
  const dateStarted = (row['Date Started'] && row['Date Started'].trim()) 
    ? new Date(row['Date Started']) 
    : null;
  const dateFinished = (row['Date Finished'] && row['Date Finished'].trim()) 
    ? new Date(row['Date Finished']) 
    : null;

  // Map reading status
  let status = 'want-to-read';
  if (row.Status === 'Read') {
    status = 'read';
  } else if (row.Status === 'Currently Reading') {
    status = 'currently-reading';
  }

  // Clean ISBN - remove non-digits, only use if valid length
  let cleanIsbn = null;
  if (row.ISBN && row.ISBN.trim()) {
    const digitsOnly = row.ISBN.replace(/[^0-9]/g, '');
    if (digitsOnly.length === 10 || digitsOnly.length === 13) {
      cleanIsbn = digitsOnly;
    }
  }

  // Parse page count
  let pageCount = null;
  if (row['Number of Pages'] && row['Number of Pages'].trim()) {
    const parsed = parseInt(row['Number of Pages']);
    if (!isNaN(parsed) && parsed > 0) {
      pageCount = parsed;
    }
  }

  // Parse year
  let publicationYear = null;
  if (row['Year Published'] && row['Year Published'].trim()) {
    const parsed = parseInt(row['Year Published']);
    if (!isNaN(parsed) && parsed >= 1000 && parsed <= new Date().getFullYear() + 1) {
      publicationYear = parsed;
    }
  }

  return {
    title: fullTitle,
    author: (row.Author && row.Author.trim()) ? row.Author.trim() : 'Unknown',
    genre: (row.Genre && row.Genre.trim()) ? row.Genre.trim() : null,
    publicationYear: publicationYear,
    isbn: cleanIsbn,
    brigittesRating: brigittesRating,
    brigittesNotes: (row.Notes && row.Notes.trim()) ? row.Notes.trim() : '',
    tags: row.Tags ? row.Tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    pageCount: pageCount,
    status: status,
    dateStarted: dateStarted,
    dateFinished: dateFinished,
    addedBy: addedById,
    coverImage: null // We don't have cover images in the CSV
  };
};

const importBooks = async () => {
  try {
    // Get the admin user (you'll need to replace this with actual admin user ID)
    // For now, we'll use the first user we find
    const User = require('../src/models/User');
    const adminUser = await User.findOne({ role: 'super-admin' });
    
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log(`Importing books as user: ${adminUser.username}`);

    const csvPath = path.join(__dirname, '..', '..', 'BookBuddy.csv');
    const books = [];
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Read and parse CSV
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Only import books with a title
          if (row.Title && row.Title.trim()) {
            const bookData = mapBookBuddyToBook(row, adminUser._id);
            books.push(bookData);
          } else {
            skippedCount++;
          }
        } catch (err) {
          console.error(`Error parsing row: ${err.message}`);
          errorCount++;
        }
      })
      .on('end', async () => {
        console.log(`\nParsed ${books.length} books from CSV`);
        console.log(`Skipped ${skippedCount} rows (no title)`);
        console.log(`Errors: ${errorCount}`);
        console.log('\nStarting import to database...\n');

        // Import books in batches of 100 to avoid overwhelming the database
        const batchSize = 100;
        for (let i = 0; i < books.length; i += batchSize) {
          const batch = books.slice(i, i + batchSize);
          try {
            await Book.insertMany(batch, { ordered: false });
            importedCount += batch.length;
            console.log(`Imported batch ${Math.floor(i / batchSize) + 1}: ${importedCount}/${books.length} books`);
          } catch (err) {
            // Show first error for debugging
            if (i === 0 && err.writeErrors && err.writeErrors.length > 0) {
              console.log('\nFirst error details:');
              console.log(err.writeErrors[0]);
              console.log('Book data:', JSON.stringify(batch[0], null, 2));
            }
            // insertMany with ordered: false will continue on duplicate key errors
            // Count successful inserts
            const successfulInserts = err.insertedDocs?.length || 0;
            importedCount += successfulInserts;
            console.log(`Batch ${Math.floor(i / batchSize) + 1}: ${successfulInserts} imported, ${batch.length - successfulInserts} duplicates/errors`);
          }
        }

        console.log('\n=== Import Complete ===');
        console.log(`Total books imported: ${importedCount}`);
        console.log(`Total books in database: ${await Book.countDocuments()}`);
        
        mongoose.connection.close();
        process.exit(0);
      })
      .on('error', (err) => {
        console.error('Error reading CSV:', err);
        mongoose.connection.close();
        process.exit(1);
      });

  } catch (error) {
    console.error('Import error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

importBooks();
