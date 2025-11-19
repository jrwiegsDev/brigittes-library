/**
 * Simple NoSQL injection protection middleware
 * Recursively removes $ and . from user input to prevent MongoDB operator injection
 */
const sanitize = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item));
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    const sanitized = {};
    for (const key in obj) {
      // Remove keys that start with $ or contain .
      if (!key.startsWith('$') && !key.includes('.')) {
        sanitized[key] = sanitize(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
};

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }
  next();
};

module.exports = sanitizeMiddleware;
