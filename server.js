const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fileupload = require('express-fileupload');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

//File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Enable CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:3000',
};

app.use(cors(corsOptions));

// Mount routers
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/hotels', require('./routes/hotelRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});