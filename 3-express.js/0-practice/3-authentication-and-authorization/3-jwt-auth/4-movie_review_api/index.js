require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');
const authRoutes = require('./routes/auth');

app.use(cors());
// Middleware to parse JSON 
app.use(express.json());
// Middleware for x-www-form-urlencoded 
app.use(express.urlencoded({ extended: true }));

// Test Route 
app.get('/', (req, res) => {
  res.send('Welcome to Movie Reviews API With JWT !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} !`);
});

// console.log('Hello !');

app.use('/auth', authRoutes);