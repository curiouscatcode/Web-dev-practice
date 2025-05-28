const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = 3000;

// PSQL pool setup 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware: session object 
app.use(
  session ({
    secret: 'secret-key', // use a secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// Test Route 
app.get('/', (req,res) => {
  res.send('Book Reviews Auth Server is running !');
});

// Start server 
app.listen(port, () => {
  console.log(`Server is started on http://localhost:${port}`);
});

// SignUp Route 
// Goal: - Create a /signup post route.
// - Get username, password etc from the request
// - Hash the password using bcryptjs
// - Save user into db 
app.post('/signup', async (req,res) => {
  // 1. req.body
  const { name, password } = req.body;
  // 2. Edge case 
  if(!name || !password){
    return res.status(400).json({
      error: 'All fields are required !'
    });
  }
  // 3. try & catch 
  try {
    // 4. edge case 2: check if user already exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [name]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({
        error: 'User already exists !'
      });
    }

    // 5. Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Insert into user DB
    await pool.query(
      "INSERT INTO users (name, password) VALUES ($1, $2)",
      [name, hashedPassword]
    );
    
    // 7. response 
    res.status(201).json({
      message: 'SignUp Successful !'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// Login with Session based Auth 
// Goal:- When user logs in:-
//  - Verify their credentials 
//  - Create a session 
//  - save their info in the session
app.post('/login', async (req,res) => {
  // 1. req.body
  const { name, password } = req.body;
  // console.log(req.body);
  // console.log(name, password);
  // egde case
  if(!name || !password){
    return res.status(400).send("All fields required !");
  }
  try {
    // 2. Check if userExists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [name]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        message: 'User not found !'
      });
    }
    // Global variable:- user 
    const user = userCheck.rows[0];

    // 3. compare the password using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        error: 'Invalid credentials !'
      });
    }

    // 4. Create a session 
    req.session.userId = user.id;
    req.session.username = user.name;

    // console.log(req.session.userId);
    // console.log(req.session.username);
    // 5. response
    res.status(201).json({
      message: 'LogIn successful !'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// Protected Routes (Authorization)
// Middleware to check authentication 
function requireLogin (req, res, next){
  if(!req.session.userId){
    return res.status(401).json({
      message: 'Unauthorized. Please log in.'
    });
  }
  next();
}

// Creating Protected Routes. 
app.post('/books', requireLogin ,async (req,res) => {
  try {
    // 1. req.body
    const { title, author } = req.body;
    
    // 2. edge case 
    if(!title || !author){
      return res.status(401).json({
        error: 'All fields required !'
      });
    }

    // 3. global variable and insert command 
    const newBook = await pool.query(
      "INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *",
      [title, author]
    );

    // 4. response 
    res.status(201).json(newBook.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// Get the books for Authorzied People
app.get('/books', requireLogin, async (req,res) => {
  try {
    // global variable and select command 
    const books = await pool.query(
      "SELECT * FROM books"
    );
    // response 
    res.status(200).json(books.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// Add reviews to a book in reviews table 
// POST /reviews/:bookId → Add a review to a book
app.post('/reviews/:bookId', requireLogin, async (req,res) => {
  try {
    // 1. req.body
    const { review, rating } = req.body;
    // req.params
    const bookId = parseInt(req.params.bookId);
    console.log(bookId);
    
    if(isNaN(bookId)){
      return res.status(400).send('bookId should be a positive integer !');
    }
    // userId 
    const userId = req.session.userId;
    // 2. edge case 
    if(!review || !rating){
      return res.status(401).json({
        error: 'All fields required !'
      });
    }
    // edge case of rating.  
    if(rating < 1 || rating > 5){
      return res.status(400).send('Rating should be >= 1 AND <= 5.');
    }

    // edge case of bookId does not exists 
    const bookCheck = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [bookId]
    );
    if(bookCheck.rows.length === 0){
      return res.status(400).send(`Book with ID ${bookId} does not exists.`);
    }
    // 3. global variable and insert command 
    const newReview = await pool.query(
      "INSERT INTO reviews (user_id, book_id ,review, rating) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, bookId ,review, rating]
    );
    // 4. response 
    res.status(201).json(newReview.rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// GET /reviews/:bookId → See all reviews for a book
app.get('/reviews/:bookId', requireLogin, async (req,res) => {
  try {
    // 1. req.params 
    const bookId = parseInt(req.params.bookId);
    // 2. edge cases 
    if(!bookId){
      return res.status(400).send('Please provide bookId !');
    }
    if(isNaN(bookId)){
      return res.status(400).send('BookId should be a positive integer.');
    }
    const bookCheck = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [bookId]
    );
    if(bookCheck.rows.length === 0){
      return res.status(400).send(`Book with id: ${bookId} does not exists !`);
    }

    // 3. global variable and select command 
    const allReviews = await pool.query(
      "SELECT * FROM reviews WHERE book_id = $1",
      [bookId]
    );
    // 4. response 
    res.status(200).json(allReviews.rows); 
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// LogOut Route (Destroying Session)
app.post('/logout', (req,res) => {
  // destroy
  req.session.destroy((err) => {
    if(err){
      console.error('Logout error: ', err);
      return res.status(500).json({
        message: 'Logout failed !'
      });
    }
    // default cookie name 
    res.clearCookie("connect.sid");

    // response 
    res.json({
      message: 'Logout successful !'
    });
  });
});