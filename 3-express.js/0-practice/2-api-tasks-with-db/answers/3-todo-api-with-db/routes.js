const express = require('express');
const pool = require('./db');

const router = express.Router();

// 1. Create a new task (CREATE)
router.post('/todos', async (req,res) => {
  try {
    // req.body 
    const { task, completed = false } = req.body;
    // edge case 
    if (!task || typeof task !== 'string') {
      return res.status(400).json({ message: 'Invalid input! Task is required and must be a string.' });
    }
    
    // global variable and inserting 
    const newTask = await pool.query("INSERT INTO todos (task, completed) VALUES ($1, $2) RETURNING *",
      [task, completed]
    );
    // response 
    res.status(200).json(newTask.rows[0]);
  } catch (err) {
    // error case 
    console.error(err);
    // error response 
    res.status(500).send('Server error !');
  }
});

// 2. Get all taskss (READ ALL)
router.get('/todos', async (req,res) => {
  try {
    // 1. Extract the query parameter 
    const { completed, sort } = req.query;
    
    // 2. Base query
    let query = "SELECT * FROM todos";
    let values = [];

    // 3. Filtering (if completed parameter exists)
    if (completed !== undefined){
      query += " WHERE completed = $1"; //space before WHERE is imp
      values.push(completed === "true"); // convert string to boolean
    }

    // 4. sorting (if sort paramter exists)
    if (sort == "asc"){
      query += " ORDER BY created_at ASC";   // space before ORDER BY
    } else if (sort === "desc"){
      query += " ORDER BY created_at DESC";
    }

    // 5. Extract the query
    const allTasks = await pool.query(query, values);

    // 6. response 
    res.status(200).json(allTasks.rows);
  } catch (err) {
    // 3. console log the error
    console.log(err);
    res.status(500).send("Server error");
  }  
});

// 3. Get tasks by ID (READ BY ID)
// a. create the route
router.get('/todos/:id', async (req,res) => {
  try {
    // b. req.params
    const { id } = req.params;
    // c. global variables and Select command
    const tasks = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
    // d. edge case: If row is empty or id doesn't exists 
    if(tasks.rows.length === 0){
      return res.status(404).send("tasks not found !");
    }
    // e. response 
    res.status(200).json(tasks.rows[0]);
  } catch (err) {
    // f. console log the error 
    console.log(err);
    // g. response
    res.status(500).send("Server error !");
  }
});

// 4. Update a tasks (UPDATE)
// a. Create the route 
router.put("/todos/:id", async (req,res) => {
  try {
      // b. req.params 
  const { id } = req.params;
  // c. req.body
  const { task, completed = false} = req.body; 
  // edge case: if user didn't put all the fields; here only task because completed can be empty and it willbe false by default
  if(!task){
    return res.status(400).json({
      message: 'Please provide all the required fields !'
    });
  }
  // d. global varibale and updating 
  const updatedTask = await pool.query(
    "UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *", 
    [task, completed, id]
  );
  // e. response 
  res.status(200).json(updatedTask.rows[0]);
  } catch (err) {
    // f. console log the error 
    console.error(err);
    // g. error response 
    res.status(500).send("Server error !");
  }
});

// 5. PATCH (UPDATE CERTAIN THINGS)
router.patch("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { task, completed } = req.body;

    // Update only provided fields, keep others unchanged
    const updatedTask = await pool.query(
      "UPDATE todos SET task = COALESCE($1, task), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *",
      [task, completed, id]
    );

    res.status(200).json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error!");
  }
});

// 6. deleting a task (DELETE)
// a. create the routes 
router.delete('/todos/:id', async (req,res) => {
  try {
    // b. req.params 
    const { id } = req.params;
    // c. Deleting from db 
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    // d. response 
    res.status(200).json({
      message: "Task deleted successfully !"
    });
  } catch (err) {
    // e. console log the error 
    console.error(err);
    // f. error response 
    res.status(500).send('Server error');
  }
})

module.exports = router;