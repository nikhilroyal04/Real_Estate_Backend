const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('../database/db');
const consoleManager = require('../utils/consoleManager');
const CookieManager = require('../middleware/personalizationHandler');

dotenv.config();
const app = express();

// CORS Configuration for credentialed requests
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins for development
    callback(null, true);
  },
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true // Allow credentials (cookies, HTTP authentication)
}));

// Parse cookies
app.use(cookieParser());

// Apply cookie handling middleware
app.use(CookieManager.applyCookiePersonalization);
app.use(CookieManager.applyPersonalization);

// Connect to MongoDB (cached connection)
connectDB().catch((error) => {
  consoleManager.error(`Database connection failed: ${error.message}`);
  process.exit(1);
});

// Middleware
app.use(express.json());

// Define routes
const roles = require('../routes/roles/role_routes');
const users = require('../routes/users/user_routes');
const properties = require('../routes/properties/prop_routes');
const leads = require('../routes/leads/lead_route');
const contacts = require('../routes/contact/contact_route');
const login = require('../routes/auth/login');
const profile = require('../routes/auth/profile');

app.use('/v1/role', roles);
app.use('/v1/user', users);
app.use('/v1/property', properties);
app.use('/v1/lead', leads);
app.use('/v1/contact', contacts);
app.use('/v1/auth', login);
app.use('/v1/get', profile);

// Error handling middleware
app.use((err, req, res, next) => {
  consoleManager.error(`Server error: ${err.stack}`);
  res.status(err.status || 500).send(err.message || 'Something went wrong!');
});

module.exports = app;
