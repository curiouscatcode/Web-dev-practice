const express = require('express');
const pool = require('./db');
const userRouter = require('./routes');

const app = express();
// middleware to parse json 
app.use(express.json());

// home page 
app.get('/', (req,res) => {
  res.send('Welcome to the Todo API !');
});

// Mount the routes 
app.use('/api', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});