const Book = require('../models/Book');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');

// Get dashboard statistics
const getStats = async (req, res, next) => {
  try {
    // Get total counts
    const totalBooks = await Book.countDocuments();
    const totalPosts = await BlogPost.countDocuments({ status: 'published' });
    const totalDrafts = await BlogPost.countDocuments({ status: 'draft' });
    const totalUsers = await User.countDocuments();

    // Get total likes across all posts
    const likesResult = await BlogPost.aggregate([
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);
    const totalLikes = likesResult.length > 0 ? likesResult[0].totalLikes : 0;

    // Get average book rating
    const ratingsResult = await Book.aggregate([
      { $match: { brigittesRating: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: '$brigittesRating' }, count: { $sum: 1 } } }
    ]);
    const avgRating = ratingsResult.length > 0 ? ratingsResult[0].avgRating : 0;
    const ratedBooks = ratingsResult.length > 0 ? ratingsResult[0].count : 0;

    // Get most recent post
    const recentPost = await BlogPost.findOne({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('title publishedAt');

    // Get most recent book
    const recentBook = await Book.findOne()
      .sort({ createdAt: -1 })
      .select('title createdAt');

    res.json({
      success: true,
      data: {
        books: {
          total: totalBooks,
          rated: ratedBooks,
          avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : 0,
          recent: recentBook
        },
        posts: {
          total: totalPosts,
          drafts: totalDrafts,
          totalLikes,
          recent: recentPost
        },
        users: {
          total: totalUsers
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats
};
