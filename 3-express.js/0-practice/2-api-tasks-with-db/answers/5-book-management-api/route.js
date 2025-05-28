const express = require('express');
const pool = require('./db');

const router = express.Router();

// 1. Create the route (CREATE)
router.post('/books', async (req,res) => {
  try {
    //a. req.body
    const { title ,author, genre, published_year } = req.body;
    //b. global variable and insert command 
    const newBook = await pool.query("INSERT INTO books (title, author, genre, published_year) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, author, genre, published_year]
    );
    // c. response 
    res.status(200).json(newBook.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// 2. Get all books (READ)
router.get('/books', async (req,res) => {
  try {
    // a. Extract the query using req.query
    const { title, author, genre, published_year, sort } = req.query;

    // b. Base query
    let query = "SELECT * FROM books";
    let values = [];
    let conditions = [];

    // c. Filtering 
    if(title !== undefined){
      conditions.push(`title ILIKE $${values.length + 1}`);
      values.push(`%${title}%`);
    } 
    if (author !== undefined){
      conditions.push(`author ILIKE $${values.length + 1}`);
      values.push(`%${author}%`);
    } 
    if (genre !== undefined){
      conditions.push(`genre ILIKE $${values.length + 1}`);
      values.push(`%${genre}%`);
    }
    if (published_year !== undefined){
      conditions.push(`published_year = $${values.length + 1}`);
      values.push(published_year);
    }

    if (conditions.length > 0){
      query += " WHERE " + conditions.join(" AND ");
    }

    // d. sorting 
    if(sort === "asc"){
      query += " ORDER BY created_at ASC";
    } else if(sort === "desc"){
      query += " ORDER BY created_at DESC";
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// Get user by ID (READ BY ID)
router.get('/books/:id', async (req,res) => {
  try {
    // a. req.params 
    const { id } = req.params;
    // b. global variable and select command
    const book = await pool.query("SELECT * FROM books WHERE id = $1", 
      [id]
    );
    // c. edge case : if no data or no data with that specific id 
    if(book.rows.length === 0){
      return res.status(404).send('Book not found !');
    }
    // d. response 
    res.status(200).json(book.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 4. UPDATE A BOOK (UPDATE)
router.put('/books/:id', async (req,res) => {
  try {
   // a. req.params 
   const { id } = req.params;
   // b. req.body
   const { title, author, genre, published_year } = req.body;
   // c. global variable and update command 
   const updatedBook = await pool.query("UPDATE books SET title = $1, author = $2, genre = $3, published_year = $4 WHERE id = $5 RETURNING *", 
    [title, author, genre, published_year, id] 
    );
    // d. edge case 
    if(!title || !author || !genre || !published_year){
      return res.status(400).json({
        message: 'Please input all required things: title, author, genre, published_year'
      });
    }
    // e. response 
    res.status(200).json(updatedBook.rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

router.delete("/books/:id", async (req,res) => {
  try {
    // a. req params 
    const { id } = req.params;
    // b.Delete command
    await pool.query("DELETE FROM books WHERE id = $1",
      [id]
    );
    // c. response 
    res.status(200).json({
      message: 'Book deleted successfully !'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
})

module.exports = router;