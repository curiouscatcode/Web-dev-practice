const express = require('express');
const pool = require('./db');
const userRoute = require('./route');

const app = express();

// middleware to parse json 
app.use(express.json());

app.use('/api', userRoute);

// home page
app.get('/', (req,res) => {
  res.send('Welcome to resume and job matching API !');
});

// port connection 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});