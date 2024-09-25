const CookieManager = require('../utils/cookieManager');

// Middleware to apply cookie-based personalization for anonymous users
function applyCookiePersonalization(req, res, next) {
  const recentSearches = CookieManager.getCookie(req, 'recentSearches') || [];
  req.recentSearches = recentSearches;
  next();
}

// Middleware to handle personalization
function applyPersonalization(req, res, next) {
  const recentSearches = req.recentSearches || [];
  req.personalization = {
    recentSearches
  };
  next();
}

module.exports = {
  applyCookiePersonalization,
  applyPersonalization
};
