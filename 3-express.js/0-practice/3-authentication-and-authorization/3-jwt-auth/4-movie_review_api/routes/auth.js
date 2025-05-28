const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');
const checkAdmin = require('../middleware/checkAdmin');
const checkReviewer = require('../middleware/checkReviewer');

// POST /signup
router.post('/signup', async (req, res) => {
  // 1. req.body
  const { name, email, password, role } = req.body;
  // 2. edge case 01
  if(!name || !email || !password){
    return res.status(400).json({
      error: 'Name, email and password are must !'
    });
  }  
  // try & catch 
  try {
    // 3. edge case 02: check if given user already exists 
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if(checkUser.rows.length > 0){
      return res.status(400).json({
        error: `User with email: ${email} already exists !`
      });
    }

    // 4. hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert new user into DB
    let newUser;

    if(role){
      newUser = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, hashedPassword, role]
      );
    } else{
      newUser = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashedPassword]
      );
    }

    // 6. response 
    res.status(201).json({
      message: 'User created successfully !',
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    // 1. req.body
    const { name, email, password } = req.body;
    // 2. edge case 01
    if(!name || !email || !password){
      return res.status(400).json({
        error: 'All 3 fields required !'
      });
    }
    // 3. check if user even exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        error: 'Invalid credentials !'
      });
    }

    // 4. extract user data 
    const newUser = userCheck.rows[0];

    // 5. compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, newUser.password);
    // 6. If password does not match, return error 
    if(!isMatch){
      return res.status(400).json({
        error: 'Invalid credentials !'
      });
    }

    // 7. create token 
    const token = jwt.sign({
      userId: newUser.id,
      role: newUser.role
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: '12d'
    });

    // 8. response 
    res.status(200).json({
      message: 'LogIn Successful',
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /users/:id — Get details of a user by their ID (protected route).
router.get('/users/:id', requireAuth, async (req, res) => {
  try {
    // 1. req.params 
    const id = parseInt(req.params.id);
    if(!id){
      return res.status(400).json({
        error: 'Provide id !'
      });
    }
    // 2. check if user even exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        error: `No user with id: ${id} exists !`
      });
    }
    // 3. global variable and select command query 
    const user = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    // 4. response 
    res.status(200).json({
      message: `Here is info about user with id: ${id}:- `,
      user: user.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// POST /movies (Admin only) — Add a new movie to the database (title, genre, description, release year, rating).
router.post('/movies', requireAuth, checkAdmin, async (req, res) => {
  try {
    // 1. req.body 
    const { title, description, release_year, rating, genre } = req.body;
    // 2. edge case 01
    if(!title || !release_year || !rating || !genre){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // 3. Getting genre_id 
    const genreResult = await pool.query(
      "SELECT id FROM genres WHERE name = $1",
      [genre]
    );
    if(genreResult.rows.length === 0){
      return res.status(400).json({
        error: `Genre "${genre}" not found !`
      });
    }
    const genre_id = genreResult.rows[0].id;

     // Global variable and insert command 
     const newMovie = await pool.query(
      "INSERT INTO movies (title, description, release_year, rating, genre_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, release_year, rating, genre_id]
     );

     // response 
     res.status(200).json({
      message: 'New movie inputed successfully !',
      newMovie: newMovie.rows[0]
     });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /movies — Get a list of all movies
router.get('/movies', requireAuth, async (req, res) => {
  try {
    // check if any movie exists or not 
    const movieCheck = await pool.query(
      "SELECT * FROM movies"
    );
    if(movieCheck.rows.length === 0){
      return res.status(400).json({
        error: 'No movie exists in the list !'
      });
    }

    // global variable and select command 
    const allMovies = await pool.query(
      "SELECT * FROM movies"
    );
    // response 
    res.status(200).json({
      message: 'Here\'s the list of all movies:- ',
      movies: allMovies.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /movies/:id — Get details of a specific movie by its ID.
router.get('/movies/:id', requireAuth, async (req, res) => {
  try {
    // 1. req.params 
    const movieId = parseInt(req.params.id);
    if(!movieId){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // 2. check if movie with given id exists in DB or not 
    const checkMovie = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [movieId]
    );
    if(checkMovie.rows.length === 0){
      return res.status(400).json({
        error: `No movie with id: ${movieId} exists !`
      });
    }   
    // 3. global variable and select command 
    const movie = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [movieId]
    );
    // 4. response 
    res.status(200).json(movie.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// PATCH /movies/:id (Admin only) — Edit movie details (e.g., update rating, description).
router.patch('/movies/:id', requireAuth, checkAdmin, async (req, res) => {
  try {
    // 1. req.body 
    const { title, description, release_year, rating, genre } = req.body;
    if(!title){
      return res.status(400).json({
        error: 'Title is compulsory !'
      });
    }

    // 2. req.params 
    const movieId = parseInt(req.params.id);
    if(!movieId){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // 3. check if movie with given id exists in DB or not 
    const checkMovie = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [movieId]
    );
    if(checkMovie.rows.length === 0){
      return res.status(400).json({
        error: `No movie with id: ${movieId} exists !`
      });
    }   

    // 4. genre_id in db
    const genreResult = await pool.query(
      "SELECT id FROM genres WHERE name = $1",
      [genre]
    );
    
    if(genreResult.rows.length === 0){
      return res.status(400).json({
        error: `Genre "${genre}" not found !`
      });
    }
    
    const genre_id = genreResult.rows[0].id;

    // 5. global variable and update command
    const updatedMovie = await pool.query(
      "UPDATE movies SET title = $1, description = $2, release_year = $3, rating = $4, genre_id = $5 WHERE id = $6 RETURNING *",
      [title, description, release_year, rating, genre_id, movieId]
    );

    // 6. response 
    res.status(200).json(updatedMovie.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// DELETE /movies/:id (Admin only) — Delete a movie from the database
router.delete('/movies/:id', requireAuth, checkAdmin, async (req, res) => {
  try {
    // 1. req.params 
    const movieId = parseInt(req.params.id);
    if(!movieId){
      return res.status(400).json({
        error: 'Please provide movieId !'
      });
    }

    // 2. check if movie with given id exists or not 
    const checkMovie = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [movieId]
    );
    if(checkMovie.rows.length === 0){
      return res.status(400).json({
        error: `No movie with id: ${movieId} exists !`
      });
    }   

    // 3. delete command 
    await pool.query(
      "DELETE FROM movies WHERE id = $1",
      [movieId]
    );

    // 4. response 
    res.status(200).json({
      message: `Movie with id: ${movieId} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// POST /movies/:id/reviews (Protected) — Add a review for a movie. The review should include rating (1-10), text, and the user who is reviewing.
router.post('/movies/:id/reviews', requireAuth, async (req, res) => {
  try {
    // 1. req.params 
    const movieId = parseInt(req.params.id);
    if(!movieId){
      return res.status(500).json({
        error: 'Please provide movieId !'
      });
    }

    // 2. user_id
    const user_id = req.user.id;
    
    // 3. req.body
    const { rating, review_text } = req.body;
    if(!rating || !review_text){
      return res.status(400).json({
        error: 'Provide rating and review text !'
      });
    }

    // 4. check if movie with given id exists or not 
    const checkMovie = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [movieId]
    );
    if(checkMovie.rows.length === 0){
      return res.status(400).json({
        error: `No movie with id: ${movieId} exists !`
      });
    }  

    // 5. global variable and insert command
    const newReview = await pool.query(
      "INSERT INTO reviews (movie_id, user_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *",
      [movieId, user_id, rating, review_text]
    )
  
    // 5. response 
    res.status(200).json({
      message: `Review for movie with id: ${movieId} added successfully !`,
      review: newReview.rows[0]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'Server error !' 
    });    
  }  
});

// GET /movies/:id/reviews — Get all reviews for a specific movie.
router.get('/movies/:id/reviews', requireAuth, async (req, res) => {
  try {
    // 1. req.params 
    const movieId = parseInt(req.params.id);
    if(!movieId){
      return res.status(400).json({
        error: 'Please provide movieId !'
      });
    }

    // 2. check if movie exists or not
    const checkMovie = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [movieId]
    );
    if(checkMovie.rows.length === 0){
      return res.status(400).json({
        error: `No movie with id: ${movieId} exists !`
      });
    }  

    // global variable and select command for getting all reviews under a movie 
    const allReviews = await pool.query(
      "SELECT * FROM reviews WHERE movie_id = $1",
      [movieId]
    );
    if(allReviews.rows.length === 0){
      return res.status(400).json({
        error: `No review under movie with id: ${movieId} exists !`
      });
    }

    // response 
    res.status(200).json({
      message: `Here are all reviews under movie with id: ${movieId}:- `,
      allReviews: allReviews.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// PATCH /reviews/:id (Protected, user must be the reviewer) — Edit a review.
router.patch('/reviews/:id', requireAuth, checkReviewer, async (req, res) => {
  try {
    // 1. req.parmas 
    const reviewId = parseInt(req.params.id);
    if(!reviewId){
      return res.status(400).json({
        error: 'Please provide reviewId !'
      });
    }

    // 2. req.body
    const { rating, review_text } = req.body;

    // 3. edge case 02
    if(!rating || !review_text){
      return res.status(400).json({
        error: 'Provide all fields !'
      });
    }

    // 4. global variable and update command 
    const updated = await pool.query(
      `UPDATE reviews 
       SET rating = $1, review_text = $2 
       WHERE id = $3 
       RETURNING *`,
      [
        rating || req.review.rating,
        review_text || req.review.review_text,
        reviewId
      ]
    );

    // 5. response 
    res.status(200).json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// DELETE /reviews/:id (Protected, user must be the reviewer) — Delete a review.
router.delete('/reviews/:id', requireAuth, checkReviewer, async (req, res) => {
  try {
    // 1. req.params for reviewId 
    const reviewId = parseInt(req.params.id);
    
    // 2. edge case is already done in the middleware 

    // 3. global variable and delete command 
    await pool.query(
      "DELETE FROM reviews WHERE id = $1",
      [reviewId]
    );

    // 4. response 
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

// POST /movies/:id/rate (Protected) — Users can rate a movie from 1 to 10. If the user has already rated the movie, they can update their rating.
router.post('/movies/:id/rate', requireAuth, async (req, res) => {
  try {
    // 1. req.params , getting movieId 
    const movie_id = parseInt(req.params.id);
    if(!movie_id){
      return res.status(400).json({
        error: 'Please provide movie_id !'
      });
    }

    // 2. get user_id 
    const user_id = req.user.id;

    // 3. req.body for rating
    const { rating } = req.body;

    // edge case 01 
    if(!rating){
      return res.status(400).json({
        error: 'Give rating !'
      });
    }

    // edge case 02: if rating is not in the range 
    if(rating < 1 || rating > 10){
      return res.status(400).json({
        error: 'Rating must be between 1 and 10 !'
      });
    }

    // edge case 03: check if movie with given id exists or not 
    const movieCheck = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [movie_id]
    );

    if(movieCheck.rows.length === 0){
      return res.status(400).json({
        error: `Movie with id: ${movie_id} does not exists !`
      });
    }

    // edge case 05: check if rating input is number or not
    if(!rating || typeof rating !== 'Integer'){
      return res.status(400).json({
        error: 'Rating must be an integer between 1 and 10 !'
      });
    }

    // 4. global variable and insert command 
    const newRating = await pool.query(
      "INSERT INTO movie_ratings (user_id, movie_id, rating) VALUES ($1, $2, $3) RETURNING *",
      [user_id, movie_id, rating]
    );

    // 5. response 
    res.status(200).json({
      message: `Rating for movie with id: ${movie_id} added successfully !`,
      rate: newRating.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// POST /movies/:id/like (Protected) — Users can like a movie. Each user can only like a movie once.
// - Like or unlike a movie (toggle).
// Also, add feature of like and dislike. 
// Steps:- 1. Check if the like already exists 
// 2. If it does exist, delete it (unlike)
// 3. If it does not exist, insert it (like)
router.post('/movies/:id/like', requireAuth, async (req, res) => {
  try {
    // 1. req.params for movie_id 
    const movie_id = parseInt(req.params.id);
    if(!movie_id){
      return res.status(400).json({
        error: 'Please provide movie_id !'
      });
    }
    
    // 2. req.user to extract user_id 
    const user_id = req.user.id;

    // 3. edge case 01: if no movie with given id exists 
    const movieCheck = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [movie_id]
    );
    if(movieCheck.rows.length === 0){
      return res.status(400).json({
        error: `Movie with id: ${movie_id} does not exists !`
      });
    }

    // 4. check if like exists or not 
    const likeCheck = await pool.query(
      "SELECT * FROM likes WHERE movie_id = $1 AND user_id = $2",
      [movie_id, user_id]
    );
    if(likeCheck.rows.length > 0){
      // Unlike  
      await pool.query(
        "DELETE FROM likes WHERE movie_id = $1 AND user_id = $2",
        [movie_id, user_id]
      );
      return res.status(200).json({
        message: `Movie with id: ${movie_id} was unliked by user with id: ${user_id} successfully ! `
      });
    } else {
      await pool.query(
        "INSERT INTO likes (movie_id, user_id, like_status) VALUES ($1, $2, $3) RETURNING *",
        [movie_id, user_id, true]
      );
      return res.status(200).json({
        message: `Movie with id: ${movie_id} was liked by user with id: ${user_id} !`
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// POST /movies/:id/dislike (Protected) — Users can dislike a movie. Each user can only dislike a movie once.
router.post('/movies/:id/dislike', requireAuth, async (req, res) => {
  try {
    // 1. req.params for movie_id 
    const movie_id = parseInt(req.params.id);
    if(!movie_id){
      return res.status(400).json({
        error: 'Please provide movie_id !'
      });
    }
    
    // 2. req.user to extract user_id 
    const user_id = req.user.id;

    // 3. edge case 01: if no movie with given id exists 
    const movieCheck = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [movie_id]
    );
    if(movieCheck.rows.length === 0){
      return res.status(400).json({
        error: `Movie with id: ${movie_id} does not exists !`
      });
    }

    // 4. check if like exists or not 
    const dislikeCheck = await pool.query(
      "SELECT * FROM likes WHERE movie_id = $1 AND user_id = $2",
      [movie_id, user_id]
    );
    if(dislikeCheck.rows.length > 0){
      // Un-dislike  
      await pool.query(
        "DELETE FROM likes WHERE movie_id = $1 AND user_id = $2",
        [movie_id, user_id]
      );
      return res.status(200).json({
        message: `Movie with id: ${movie_id} was un-disliked by user with id: ${user_id} successfully ! `
      });
    } else {
      await pool.query(
        "INSERT INTO likes (movie_id, user_id, like_status) VALUES ($1, $2, $3) RETURNING *",
        [movie_id, user_id, false]
      );
      return res.status(200).json({
        message: `Movie with id: ${movie_id} was disliked by user with id: ${user_id} !`
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});


// Movie Genres:
// POST /genres (Admin only) — Create new genres for categorizing movies.
router.post('/genres', requireAuth, checkAdmin, async (req, res) => {
  try {
    // 1. req.body
    const { name } = req.body;
    // 2. edge case 01
    if(!name){
      return res.status(400).json({
        error: 'Please provide genre name !'
      });
    }

    // 3. using a formatted name so genre entries are case insensitive 
    const formattedName = name.trim().toLowerCase();

    // 4. edgecase 02: check if genre already exists 
    const checkGenre = await pool.query(
      "SELECT * FROM genres WHERE name = $1",
      [formattedName]
    );
    if(checkGenre.rows.length > 0){
      return res.status(400).json({
        error: `${formattedName} genre already exists !`
      });
    }
    // 5. global variable and insert command 
    const genre = await pool.query(
      "INSERT INTO genres (name) VALUES ($1) RETURNING *",
      [formattedName]      
    );

    //6. response 
    res.status(200).json(genre.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /genres — Get all available genres.
router.get('/genres', requireAuth, async (req, res) => {
  try {
    // check if any genre exists or not 
    const checkGenre = await pool.query(
      "SELECT * FROM genres"
    );
    if(checkGenre.rows.length === 0){
      return res.status(400).json({
        error: 'No genre exists in the list !'
      });
    }

    // global variable and select command 
    const allGenres = await pool.query(
      "SELECT * FROM genres"
    );

    // response 
    res.status(200).json({
      message: 'Here\'s all the genres present in DB:- ',
      allGenres: allGenres.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

module.exports = router;