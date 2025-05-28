const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// SIGNUP Route
router.post('/signup', async (req,res) => {
  try {
    // req.body
    const { username, password, role } = req.body;

    // Check if username and password provided - edge case 1 
    if(!username || !password){
      return res.status(400).send('Username and password required');
    }

    // check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if(userExists.rows.length > 0){
      return res.status(400).send('User already exists');
    }

    // Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB 
    const newUser = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role ",
      [username, hashedPassword, role || 'user']
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// LOGIN Route 
router.post('/login', async (req,res) => {
  try {
    // req.body
    const { username, password } = req.body;

    // check input: edge case-1
    if(!username || !password){
      return res.status(400).send('Username and password required !');
    }

    // Find user 
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if(userResult.rows.length === 0){
      return res.status(400).send('Invalid credientials !');
    }

    const user = userResult.rows[0];

    // compare password 
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).send('Invalid credentials');
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h'}
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

module.exports = router;