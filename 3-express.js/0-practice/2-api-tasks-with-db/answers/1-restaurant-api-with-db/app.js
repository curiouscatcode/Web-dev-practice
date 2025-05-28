const express = require('express');
const pool = require('./db');
const userRoute = require('./route');

const app = express();

// middleware to parse json
app.use(express.json());

app.use('/api', userRoute);

// home page
app.get('/', (req,res) => {
  res.status(200).send('Welcome to Restaurant API !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});