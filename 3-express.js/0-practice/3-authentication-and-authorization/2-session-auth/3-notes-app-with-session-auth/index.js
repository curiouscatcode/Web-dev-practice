const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = 3000;

// psql pool setup 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'secret-key', // Use a secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true only if using HTTPS
  })
);

// Test Route
app.get('/', (req,res) => {
  res.send('Notes_session_auth is running !');
});

// Start server 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Signup Route
app.post('/signup', async (req,res) => {
  // 1. req.body:- adding user
  const { name, password } = req.body;
  // 2. edge case: if one of them is not provided 
  if(!name || !password){
    return res.status(400).json({
      error: 'All fields are required !'
    });
  }  
  // 3. try & catch 
  try {
    // 4. check if user already exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [name]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({
        error: "Username already exists !"
      });
    }

    // 5. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Insert into DB 
    await pool.query(
      "INSERT INTO users (name, password) VALUES ($1, $2)",
      [name, hashedPassword]
    );

    // 7. response 
    res.status(200).json({
      message: "Signup successfull !"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: 'Server error !' 
    });
  }
});

// Login with Session based Auth 
// Goal:- When user logs in: - Verify their credientials 
// - create a session 
// - save their info in the session 

app.post('/login', async (req,res) => {
  // 1. req.body: extract the query  
  const { name, password } = req.body;
  try {
    // 2. check if user Exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [name]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        message: "User not found !"
      });
    }
    // Global variable 
    const user = userCheck.rows[0];

    // 3. compare the password using bcrypt 
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        message: "Invalid Credentials"
      });
    }

    // 4. create session 
    req.session.userId = user.id;
    req.session.name = user.name;

    // 5. response 
    res.status(200).json({
      message: "LogIn successfull !"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong !"
    });
  }
});

// Protected Route (Authorization)
// Here goal:- 1. Add middleware 
// 2. Allow loggedIn users to 'post' notes

// 1. Middleware to check Authentication 
function requireLogin (req, res, next) {
  if(!req.session.userId){
    return res.status(401).json({
      message: "Unauthorized. Please log in !"
    });
  }
  next();
}

// 2. Protected route to post notes 
app.post('/notes', requireLogin, async (req,res) => {
  // 1. req.body: extract the query 
  const { content } = req.body;

  const userId = req.session.userId;

  // 2. edge case: if both are not provided 
  if(!content){
    return res.status(500).json({
      error: 'Please provide all the required fields !'
    });
  }

  // 3. global variable and insert command 
  const newNote = await pool.query(
    "INSERT INTO notes (user_id ,content) VALUES ($1, $2) RETURNING *",
    [userId ,content]
  );

  // 4. response 
  res.status(200).json(newNote.rows[0]);

  console.log("Current session user ID:", req.session.userId);
});
