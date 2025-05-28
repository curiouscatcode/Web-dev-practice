const express = require('express');
const pool = require('./db');

const router = express.Router();

// 1. Create a new Task (CREATE)
// a. create the route 
router.post('/tasks', async (req,res) => {
  try {
    // b. req.body
    const { title, description, status, due_date } = req.body;
    // c. edge case
    if(!title || !description || !status || !due_date){
      return res.status(404).send('Please provide all the required: title, description, status, due_date');
    }
    // d. gloabl variable and Insert command 
    const newTask = await pool.query("INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, status, due_date]
    );
    // e. response 
    res.status(200).json(newTask.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// Get all tasks (READ)
// a. define the routes
router.get('/tasks', async (req,res) => {
  try {
    // b. extract the query
    const { title, status, sort } = req.query;
    // c. base query 
    let query = "SELECT * FROM tasks";
    let values = [];
    let conditions = [];
    // d. filtering 
    if(title !== undefined){
      conditions.push(`title ILIKE $${values.length + 1}`);
      values.push(`%${title}%`);
    }
    if(status !== undefined){
      conditions.push(`status ILIKE $${values.length + 1}`);
      values.push(`${status}`);
    }

    // e. Add WHERE clause only if there are conditions, joining them with AND

    if(conditions.length > 0){
      query += " WHERE " + conditions.join(" AND ");
    }

    // f. Sorting (if sort parameter exists)
    if(sort === 'asc'){
      query += " ORDER BY created_at ASC";
    } else if( sort === 'desc'){
      query += " ORDER BY created_at DESC";
    }

    // g. response 
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// Get task by id (READ)
router.get('/tasks/:id', async (req,res) => {
  try {
    // a. req params 
    const { id } = req.params;
    // b. global variable and Select command 
    const task = await pool.query('SELECT * FROM tasks WHERE id = $1', 
      [id]
    );
    // c. response 
    res.status(200).json(task.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }  
});

// Update a task (UPDATE)
router.put('/tasks/:id', async (req,res) => {
  try {
    // a. req params 
    const { id } = req.params;
    // b. req.body
    const { title, description, status, due_date } = req.body;
    // c. edge case 
    if(!title || !description || !status || !due_date){
      return res.status(400).send('Please provide all the required fields: title, description, status, due_date');
    }
    // d. global variable and update command 
    const updatedTask = await pool.query("UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4 WHERE id = $5 RETURNiNG *", 
      [title, description, status, due_date, id]
    );
    // e. response 
    res.status(200).json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// Delete a task (DELETE)
router.delete('/tasks/:id', async (req,res) => {
  try {
    // req.params
    const { id } = req.params;
    // delete command 
    await pool.query('DELETE FROM tasks WHERE id = $1',
      [id]
    );
    // response 
    res.status(200).json({
      message: 'Task deleted successfully !'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
})

module.exports = router;