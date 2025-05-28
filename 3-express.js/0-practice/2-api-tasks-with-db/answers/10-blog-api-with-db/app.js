const express = require('express');
const pool = require('./db');
const userRoutes = require('./route');

const app = express();

// middleware to parse json 
app.use(express.json());

app.use('/api', userRoutes);

// home page 
app.get('/', (req,res) => {
  res.status(200).send('Welcome to BlogsAPI !');
});

// server starts
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is runnning on port ${PORT}`);
});