// boiler plate code 
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// middleware to parse json
app.use(bodyParser.json());

app.use(session({
  secret: 'supersecretkey', // should be in .env
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // secure: true only on HTTPS
}));

// Fake User (usually in DB)
const USER = {
  username: 'admin',
  password: '1234'
};

// Login Route 
app.post('/login', (req,res) => {
  // req.body
  const { username, password } = req.body;
  // storing in session 
  if(username === USER.username && password === USER.password){
    req.session.user = username; // store in session 
    res.send({
      message: 'Logged in successfully !'
    });
  } else {
    res.status(401).send({
      message: 'Invalid Credientials !'
    });
  }
});

// Protected Route 
app.get('/dashboard', (req,res) => {
  if(req.session.user){
    res.send({
      message: `Welcome ${req.session.user}`
    });
  } else {
    res.status(401).send({
      message: 'Please log in first !'
    });
  }
});

// Logout Route
app.post('/logout', (req,res) => {
  req.session.destroy();
  res.send({
    message: 'Logged out succesfully'
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});