const express = require('express');
const pool = require('./db');

const router = express.Router();

// 1. Create a new Router (CREATE)
// a. define the route
router.post('/movies', async (req,res) => {
  try {
    // a. req.query
    const { title, director, release_year, genre } = req.body;

    // b. edge case 
    if(!title || !director || !release_year || !genre){
      return res.status(200).send('Please provide all the required fields: title, director, release_year, genre !');
    }
    // c. gloabl variable and insert command 
    const newMovie = await pool.query("INSERT INTO movies (title, director, release_year, genre) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, director, release_year, genre]
    );
    // d. response 
    res.status(200).json(newMovie.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// 2. Get all movies
// a. define the route
router.get('/movies', async (req,res) => {
  try {
    // b. extract the query
    const { title, director, genre, sort } = req.query;
    // c. base query
    let query = "SELECT * FROM movies";
    let values = [];
    let conditions = [];

    // d. filtering 
    if(title){
      conditions.push(` title ILIKE $${values.length + 1}`);
      values.push(`%${title}%`);
    }
    if(director){
      conditions.push(` director ILIKE $${values.length + 1}`);
      values.push(`%${director}%`)
    }
    if(genre){
      conditions.push(` genre ILIKE $${values.length + 1}`);
      values.push(`%${genre}%`);
    }
    //e. if condition and adding 
    if(conditions.length > 0){
      query += ' WHERE ' + conditions.join(" AND ");
    }

    // debugging
    console.log("Executing Query:", query);
    console.log("With Values:", values);

    // f. sorting
    if(sort === 'asc'){
      query += " ORDER BY created_at ASC";
    } else if (sort === 'desc'){
      query += " ORDER BY created_at DESC";
    }
    // g. response 
    const allMovies = await pool.query(query, values)
    res.status(200).json(allMovies.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// 3. get element by id
// a. define the route
router.get('/movies/:id', async (req,res) => {
  try {
    // b. req params 
    const { id } = req.params;
    // c. global variable and select command 
    const movie = await pool.query("SELECT * FROM movies WHERE id = $1", 
      [id]
    );
    // d.edge case 
    if(movie.rows.length === 0){
      return res.status(200).send('Movie not found !');
    }
    // e. response 
    res.status(200).json(movie.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// Update a movie (UPDATE)
// a. define the route
router.put('/movies/:id', async (req,res) => {
  try {
    // b. params 
    const { id } = req.params;
    // c. req.body
    const { title, director, release_year, genre } = req.body;
    // d. global variable and update command 
    const updatedMovie = await pool.query("UPDATE movies SET title=$1, director=$2, release_year=$3, genre=$4 WHERE id = $5 RETURNING *", 
      [title, director, release_year, genre, id]
    );
    // e. response 
    res.status(200).json(updatedMovie.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// 5. Delete a movie 
// a. define the route
router.delete('/movies/:id', async (req,res) => {
  try {
    // b. req params 
    const { id } = req.params;
    // c. delete command
    await pool.query("DELETE FROM movies WHERE id = $1",
      [id]
    );
    // d. response 
    res.status(200).json({
      message: `Movie with id ${id} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// POST `/movies/:id/reviews`** –  Add a review to a movie (user, rating, comment)
router.post('/movies/:id/reviews', async (req,res) => {
  try {
    // a. req.body & req.params
    const movie_id = req.params.id;
    const {  user_name, rating, comment } = req.body;
    // b. edge case 
    if( !user_name || !rating || !comment){
      return res.status(404).send('Please provide all the required fields: user_name, rating, comment');
    }
    // c.insert command:- query and values
    const query = "INSERT INTO reviews (movie_id, user_name, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [movie_id, user_name, rating, comment];

    // d. edge case 
    const movieExists = await pool.query("SELECT id FROM movies WHERE id = $1", [movie_id]);
    // debugging: console.log(movieExists);
    if(movieExists.rows.length === 0){
      return res.status(404).json({
        error: "Movie not found !"
      });
    }
    // e.  global variable and pool.query
    const newReview = await pool.query(query, values);

    //response 
    res.status(200).json(newReview.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 7. **GET `/movies/:id/reviews`** – Get all reviews for a movie.  
// a. define the route 
router.get('/movies/:id/reviews', async (req,res) => {
  try {
    // req.params
    const  movie_id  = req.params.id;
    // global variable and select command 
    const allReviews = await pool.query("SELECT * FROM reviews WHERE movie_id = $1", 
      [movie_id]
    );
    // response 
    res.status(200).json(allReviews.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

module.exports = router;