require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware for cors 
app.use(cors());
// Middleware to parse JSON
app.use(express.json());
// Middleware for xxx-urlencoded form 
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get('/', (req, res) => {
  res.send('JWT Blog Platform API is running !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);