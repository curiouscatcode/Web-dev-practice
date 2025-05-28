const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = 5000;

// psql pool setup 
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL,
});

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware: session object
app.use(
  session({
    secret: 'secret-key', //use a secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true only if using HTTPS
  })
);

// Test Route 
app.get('/', (req,res) => {
  res.send('Welcome to Movie Reviews API With Session Auth !');
});

// Start server 
app.listen(port, () => {
  console.log(`Server is started on http://localhost:${port}`);
});

// SignUp Route 
// Goal:- - Create a /signup post route
// - get username, password from the request. 
// - hash the password using bcryptjs. 
// - save user into users table. 
app.post('/signup', async (req,res) => {
  // req.body
  const { username, password } = req.body;
  // edge case 01: not provided
  if(!username || !password){
    return res.status(400).json({
      error: 'All fields are required !'
    });
  }   
  // try and catch 
  try {
    // edge case 02: check if user already exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1", 
      [username]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({
        error: `User with username: ${username} already exists !`
      });
    }

    // hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);
    // insert into DB
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hashedPassword]
    );

    // response 
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

// LogIn with Session Based Auth
// Goal:- When a user logs in:
// - verify their credentials
// - create a session
// - save their info in the session 
app.post('/login', async (req,res) => {
  // 1. req.body
  const { username, password } = req.body;
  // 2. edge case 01: input not provided
  if(!username || !password){
    return res.status(400).json({
      error: 'All fields are required !'
    });
  }  
  try {
    // 3. edge case: check if userExists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        message: 'User not found !'
      });
    }
    // 4. global variable: user
    const user = userCheck.rows[0];

    // 5. compare the password using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        message: 'Invalid Credentials !'
      });
    }

    // 6. create session 
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    // 7. response 
    res.status(200).json({
      message: 'LogIn Successful !'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error !'});
  }
});

// Protected Route (Authorization)
// 1. Middleware to check Authentication 
function requireLogin(req, res, next) {
  if(!req.session.userId){
    return res.status(401).json({
      message: 'Unauthorized. Please LogIn.'
    });
  }  
  next();
}

// 2. Middleware for admin who is allowed to input movies 
function requireAdmin(req, res, next) {
  if(req.session.role !== 'admin'){
    return res.status(403).json({
      message: 'Access denied. Admins only.'
    });
  }
  next();
}

// Post movies: allowed only for loggedin and admin (both conditions should be met)
app.post('/movies', requireLogin, requireAdmin, async (req,res) => {
  try {
    // 1. req.body
    const { title, description } = req.body;
    // 2. edge case 01: all fields required 
    if(!title || !description){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // edge case 02: if movie already exists 
    const movieCheck = await pool.query(
      "SELECT * FROM movies WHERE title = $1",
      [title]
    );
    if(movieCheck.rows.length > 0){
      return res.status(400).json({
        error: `Movie with title: ${title} already exists !`
      });
    }

    // 3. global variable and insert command 
    const newMovie = await pool.query(
      "INSERT INTO movies (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    // 4. response 
    res.status(201).json(newMovie.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server starts !'
    });
  }  
});

// No AUTH needed for this two 
// GET /movies – List all movies 
app.get('/movies', async (req,res) => {
  try {
    // Check if no movie exists 
    const movieCheck = await pool.query(
      "SELECT * FROM movies"
    );
    if(movieCheck.rows.length === 0){
      return res.status(400).json({
        error: `No movie exists !`
      });
    }
    // global variable and select command 
    const allMovies = await pool.query(
      "SELECT * FROM movies"
    );
    // response 
    res.status(200).json(allMovies.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error !'});
  }  
});

// GET /movies/:id – Get movie details
app.get('/movies/:id', async (req,res) => {
  try {
   // 1. req.body
   const id = parseInt(req.params.id);
   // 2. edge case
   if(!id){
    return res.status(400).json({
      message: `Id: ${id} does not exists !`
    });
   } 
   // 3. edge case 02: check if movie with id does not exists 
   const movieCheck = await pool.query(
    "SELECT * FROM movies WHERE id = $1",
    [id]
    );
    if(movieCheck.rows.length === 0){
      return res.status(400).json({
        error: `Movie with id: ${id} does not exists !`
      });
    }
    // 4. global variable and select command 
    const movie = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [id]
    );
    // 5. response
    res.status(200).json(movie.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Starts !'});
  }  
});

// POST /movies/:id/reviews – Add a review
app.post('/movies/:id/reviews', requireLogin, async (req,res) => {
  try {
    // 1. req.body
    const { review, rating } = req.body;
    // 1.b. req.params 
    const movieId = parseInt(req.params.id);
    if(!movieId){
      return res.status(400).json({
        error: 'Please provide movie_id'
      });
    } 
    // 2. req.session
    const userId = req.session.userId;
    // 3. edge case 01
    if(!review || !rating){
      return res.status(400).json({
        error: 'All fields required.'
      });
    }
    // edge case 02: if rating is not in range or not an integer
    if(!Number.isInteger(rating) || rating < 1 || rating > 5){
      return res.status(400).json({
        error: 'Rating should be an integer in this range: [1,5].'
      });
    }
    // 4. global variable and insert command 
    const newReview = await pool.query(
      "INSERT INTO reviews (user_id, movie_id, review, rating) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, movieId, review, rating]
    );
    // response 
    res.status(201).json(newReview.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error !'});
  }  
});

// PUT /reviews/:id – Edit a review (only by author)
// This will require a separate middleware to check when who is updating is the same person who commented
async function checkReviewer(req, res, next) {
  // 1. get the review id using req.params
  const id = req.params.id;

  // 2. query database to get the review's user_id
  const reviewsUserId = await pool.query(
    "SELECT user_id FROM reviews WHERE id = $1",
    [id]
  );
  
  // edge case 
  if (reviewsUserId.rows.length === 0) {
    return res.status(404).json({ error: "Review not found." });
  }

  // 3. Compare the user_id with req.session.userId
  // For that extract the value from the reviewsUserId object
  const userIdFromReview = reviewsUserId.rows[0]?.user_id;
  
  if(userIdFromReview !== req.session.userId){
    return res.status(403).json({
      error: 'You are not authorized to delete this.'
    });
  }  
  next();
}

// PUT /reviews/:id – Edit a review (only by author)
app.put('/reviews/:id', requireLogin, checkReviewer, async (req, res) => {
  try {
    // 1. req.params
    const movieId = parseInt(req.params.id);
    if(!movieId){
      return res.status(400).json({
        error: 'Please provide id in path !'
      });
    }
    // 2. req.body
    const { review, rating } = req.body;
    
    // 3. req.session for user_id
    const userId = req.session.userId;

    // edge cases 
    if(!review || !rating){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }

    // 4. global variable and update command
    const updatedReview = await pool.query(
      "UPDATE reviews SET user_id = $1 ,review = $2, rating = $3 WHERE id = $4 RETURNING *",
      [ userId, review, rating, movieId]
    );
    // 5. response 
    res.status(200).json(updatedReview.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server Error !'
    });
  }  
});

// DELETE /reviews/:id – Delete a review (only by author)
app.delete('/reviews/:id', requireLogin, checkReviewer, async (req, res) => {
  try {
    // 1. req.params.id
    const reviewId = parseInt(req.params.id);
    if(!reviewId){
      return res.status(400).json({ error: 'Please provide id that needs to be deleted !'});
    }

    // 2. edge case check if comment with certain id exists or not
    const userCheck = await pool.query(
      "SELECT * FROM reviews WHERE id = $1", [reviewId]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        error: `Review with id: ${reviewId} does not exists ! Kisko delete kar raha hai be !`
      });
    }

    // 3. delete command
    await pool.query(
      "DELETE FROM reviews WHERE id = $1",
      [reviewId]
    );
    // response 
    res.status(200).json({
      message: `Review with id: ${reviewId} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /movies/:id/reviews – Get all reviews for a movie
app.get('/movies/:id/reviews', requireLogin, async (req,res) => {
  try {
    // 1. req.params 
    const reviewId = parseInt(req.params.id);
    // 2. edge case: no id given 
    if(!reviewId){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // 3. edge case 02: check whether comment with given id exists or not
    const reviewCheck = await pool.query(
      "SELECT * FROM reviews WHERE id = $1", 
      [reviewId]
    );
    if(reviewCheck.rows.length === 0){
      return res.status(400).json({ error: `Review with id: ${reviewId} does not exists !`});
    }

    // 4. global variable and select command 
    const review = await pool.query(
      "SELECT * FROM reviews WHERE id = $1",
      [reviewId]
    );
    // 5. response 
    res.status(200).json(review.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// LogOut Route 
// Goal:- Let the user log out which means we destroy their session & remove all stored info.
app.post('/logout', (req,res) => {
  // destroy
  req.session.destroy((err) => {
    if(err) {
      console.error("Logou error: ", err);
      return res.status(500).json({
        message: 'Logout failed !'
      });
    }
    // destroy cookie name
    res.clearCookie("connect.sid");
    // response 
    res.json({
      message: 'Logged out successfull !'
    });
  });
});