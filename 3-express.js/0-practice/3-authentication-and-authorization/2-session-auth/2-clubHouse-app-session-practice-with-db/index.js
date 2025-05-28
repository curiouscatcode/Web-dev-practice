const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = 3000;

// PostgreSQL pool setup 
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL,
});

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'secret-key', // use a secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true only if using HTTPS
  })
);

// Test ROute 
app.get('/', (req,res) => {
  res.send("Clubhouse Auth Server is running !");
});

// Start Server 
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

//  SignUp Route
app.post('/signup', async (req,res) => {
  // 1. req.body
  const { username, password, club_id } = req.body;
  
  // 2. edge case = Check if all things are provided 
  if(!username || !password || !club_id){
    return res.status(400).json({
      error: 'All fields are required.'
    });
  }

  // 3. try and catch 
  try {
    // 4. Check if user already exists 
    const userCheck = await pool.query("SELECT * FROM members WHERE username = $1", 
      [username]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({
        error: "Username already exists."
      });
    }

    //5. Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // 6. Insert into DB 
    await pool.query(
      "INSERT INTO members (username, password, club_id) VALUES ($1, $2, $3)",
      [username, hashedPassword, club_id]
    );

    // 7. response 
    res.status(201).json({
      message: "Signup Successful !"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error !"
    });
  }
});

// Login 
app.post('/login', async (req,res) => {
  // 1. req.body
  const { username, password } = req.body;
  
  try {
    // 2. Check if user exists 
    const userCheck = await pool.query(
      "SELECT * FROM members WHERE username = $1",
      [username]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        message: "User not found !"
      });
    }

    // Global variable
    const user = userCheck.rows[0];

    // 3. Compare the password using bcrypt 
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(401).json({
        message: "Invalid credientials !"
      });
    }

    // 4. Create session 
    req.session.userId = user.id;
    req.session.username = user.username;

    // 5. response 
    return res.status(200).json({
      message: "Login Successful !"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong !"
    });
  }
});

// Step 6: Protected Routes (Authorization)
// 6.1: Middleware to check authentication 
function requireLogin(req,res,next){
  if(!req.session.userId){
    return res.status(401).json({
      message: "Unauthorized. Please log in."
    });
  }
  next();
}

// 6.2: Create a protected route 
app.get('/dashboard', requireLogin, (req,res) => {
  res.json({
    message: `Welcome, ${req.session.username}! This is your dashboard.`
  });
});

// Step 7. Logout 
app.post('/logout', (req,res) => {
  // destroy the session
  req.session.destroy((err) => {
    if(err){
      console.error("Logout error: ", err);
      return res.status(500).json({
        message: "Logout Failed !"
      });
    }
    // Default cookie name 
    res.clearCookie("connect.sid");
    // response 
    res.json({
      message: "Logged out successfully !"
    });
  });
});