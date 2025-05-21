// Libraries
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Loads environment variables from a .env file into process.env
dotenv.config();

// Initialize express app (creates an instances of the express application)
const app = express();

//Enable Cors
app.use(cors());

// Middleware to parse JSON requests bodies
// without this middleware, the server cannot read JSON data sent in requests
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);


// Connect to DB in MongoDB
// mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1); // Stop the app if DB fails   
    }
};
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