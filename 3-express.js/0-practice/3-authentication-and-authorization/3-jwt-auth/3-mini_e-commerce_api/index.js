require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');
const authRoutes = require('./routes/auth');

// Middleware for cors 
app.use(cors());
// Middleware to parse JSON 
app.use(express.json());
// Middleware for x-www-urlencoded 
app.use(express.urlencoded({ extended: true }));

// Test Route 
app.get('/', (req, res) => {
  res.send('Mini E-Commerce API With JWT !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

app.use('/auth', authRoutes);