const express = require('express');
const pool = require('./db');

const router = express.Router();

// 1. Create a new user (CREATE)
// a. create the route
router.post('/notes', async (req,res) => {
  try {
    // b. req.body
    const { title, content } = req.body;
    // c. global variable and inserting 
    const newNote = await pool.query("INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *", 
      [title, content]
    );
    // d. response 
    res.json(newNote.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }  
});

// 2. Get all notes (READ)
// a. create the route
router.get('/notes', async (req,res) => {
  try {
    // a. extract query parameter
    const { title, sort } = req.query;

    // b. base query
    let query = "SELECT * FROM notes";
    let values = [];

    // c. Filtering (if title parameter exists)
    if(title !== undefined){
      query += " WHERE title ILIKE $1", [title]
      values.push(`%${title}%`);
    } 

    // d.Sorting (if sort parameter exists)
    if(sort === "asc"){
      query += " ORDER BY created_at ASC";
    } else if(sort === "desc"){
      query += " ORDER BY created_at DESC";
    }

    // e. Execute the query i.e., global variable and select command
    const allNotes = await pool.query(query, values);

    // f. response 
    res.status(200).json(allNotes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }  
});

router.get('/notes/:id', async (req,res) => {
  try {
    // a. req.params
    const { id } = req.params;
    // b. global variable and select command
    const note = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);
    // c. edge case
    if(note.rows.length === 0){
      return res.status(404).send("User not found");
    } 
    // d. response 
    res.status(200).json(note.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 4. Update a note (UPDATE)
// a. create the route
router.put("/notes/:id", async (req,res) => {
  try {
    // b. req.params 
    const { id } = req.params;
    // c. req.body
    const { title, content } = req.body;
    // d. global variable and update command 
    const updatedNote = await pool.query(" UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *", 
      [title, content, id]
    );
    // e. reponse 
    res.status(200).json(updatedNote.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 5. Delete a user (DELETE)
router.delete('/notes/:id', async (req,res) => {
  try {
    // a. req.params
    const { id } = req.params;
    // b. Delete command 
    await pool.query("DELETE FROM notes WHERE id = $1",
      [id]
    );
    // c. response 
    res.json({
      message: 'Note deleted successfully !'
    })
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
})

module.exports = router;