const express = require('express');
const pool = require('./db');
const userRoutes = require('./route');

const app = express();

// middleware to parse json
app.use(express.json());

// home page 
app.get('/', (req,res) => {
  res.status(200).send('Welcome to the Order management API !');
});

app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});