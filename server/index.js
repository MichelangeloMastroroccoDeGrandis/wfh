// Libraries
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import helmet from 'helmet';


import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import wfhRoutes from './routes/wfhRoutes.js';

// Loads environment variables from a .env file into process.env
dotenv.config();

// Initialize express app (creates an instances of the express application)
const app = express();

//Enable Cors
app.use(cors());

// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// Middleware to parse JSON requests bodies
// without this middleware, the server cannot read JSON data sent in requests
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/wfh', wfhRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to DB in MongoDB
// mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment

connectDB();

// Basic test route to check if the server is running
app.get('/', (req, res) => {
    res.send('Server is running');
    });

// Set the port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});