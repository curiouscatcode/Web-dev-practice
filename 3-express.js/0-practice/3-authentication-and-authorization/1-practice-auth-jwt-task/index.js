const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config(); // load .env variables 

const app = express();
app.use(express.json());  // middleware to parse json

// Routes 
app.use('/api/auth', authRoutes);

// Home route
app.get('/', (req,res) => {
  res.send('Welcome to the Auth App !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});