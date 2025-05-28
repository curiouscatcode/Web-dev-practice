const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { message } = require('statuses');
const { error } = require('npmlog');
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
    secret: 'secret-key', // use a secure secret in production 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true only if using HTTPS 
  })
);

// Test Route 
app.get('/', (req,res) => {
  res.send('Todo Session Auth Server is running !');
});

// Start Server 
app.listen(port, () => {
  console.log(`Server is started on http://localhost:${port}`);
});

// SignUp Route 
// Goal:- - Create a /signup post route. 
// - get name, password from the request 
// - hash the password using bcryptjs
// - save the user in todos table. 
app.post('/signup', async (req,res) => {
  // 1. req.body 
  const { name, password } = req.body;
  // 2. edge case:- if name or password not provided 
  if(!name || !password){
    return res.status(400).json({
      error: 'Please provide all the required fields !'
    });
  } 
  // 3. try and catch 
  try {
    // 4. Check if user already exists: edge case 2
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE name = $1", 
      [name]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({
        error: 'Username already exists !'
      });
    }

    // 5. Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Insert into DB 
    await pool.query(
      "INSERT INTO users (name, password) VALUES ($1, $2) ",
      [name, hashedPassword]
    );

    // 7. Response 
    res.status(200).json({
      message: 'SignUp successful !'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Something went wrong !'
    });
  } 
});

// LogIn with session based Auth 
// Goal:- When a user logs in:
//  - Verify their credentials 
//  - Create a session 
//  - Save their info in the session 
app.post('/login', async (req,res) => {
  // 1. req.body : extract the query
  const { name, password } = req.body;
  try {
    // 2. Check if user exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE name = $1", 
      [name]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        message: 'User not found !'
      });
    }

    // Global variable 
    const user = userCheck.rows[0];

    // 3. Compare the password using bcrypt 
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        message: 'Invalid credentials !'
      });
    }

    // 4. Create a session 
    req.session.userId = user.id;
    req.session.username = user.name;

    // 5. response 
    res.status(200).json({
      message: 'LogIn Successful !'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Sever Error !'
    });
  }  
});

// Protected Routes (Authorization)
// Middleware to check authentication 
function requireLogin(req, res, next){
  if(!req.session.userId){
    return res.status(401).json({
      message: "Unauthorized. Please log in."
    });
  }
  next();
}

// Create a protected route
// This route can be accessed by people who are authorized. 
// CREATE (POST)
app.post('/todos', requireLogin, async (req,res) => {
  try {
     // 1. req.body
    const { content, status } = req.body;

    const userId = req.session.userId;

    // 2. edge case 
    if(!content || !status){
      return res.status(400).json({
        error: 'Please provide all the required fields: content, status !'
      });
    }

    // 3. global variable and insert command 
    const newTask = await pool.query(
      "INSERT INTO todos (user_id ,content, status) VALUES ($1, $2, $3) RETURNING *",
      [userId, content, status]
    );

    // 4. response 
    res.status(200).json(newTask.rows[0]); 

    // test
    console.log(userId);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// READ (GET)
// Get all tasks. For that you need to be loggedIn by something !
app.get('/todos', requireLogin, async (req,res) => {
  // 1. global variable and select command 
  const allTasks = await pool.query(
    "SELECT * FROM todos"
  );

  // 2. response 
  res.status(200).json(allTasks.rows);
});

// UPDATE (PATCH)
// update the status of a specific todo
app.patch('/todos/:id', requireLogin, async (req,res) => {
  try {
    // 1. req.body of updated 
    const { status } = req.body;
    
    // 2. req.params: extract the params 
    const  id  = parseInt(req.params.id);

    // 3.a. edge case 
    if(isNaN(id)){
      return res.status(400).send('Id should be a positive integer number !');
    }

    if(!id){
      return res.status(400).send('Please provide id !');
    }
    // 3.b. Edge case 
    if(!status){
      return res.status(400).json({
        message: 'Please provide status !'
      });
    }

    // 4. global variable and update command 
    const UpdatedTask = await pool.query(
      "UPDATE todos SET status = $1 WHERE id = $2 RETURNING *", 
      [status, id]
    );

    // 5. response 
    res.status(200).json(UpdatedTask.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// DELETE A TODO TASK (DELETE)
// User should be logged in to delete the task 
app.delete('/todos/:id', requireLogin, async (req,res) => {
  try {
    // 1. req.params 
    const id = parseInt(req.params.id);
    // 2. edge case
    if(isNaN(id)){
      return res.status(400).send('Id should be a positive integer !');
    }  
    if(!id){
      return res.status(400).send('Please provide id. ')
    }
    // 3. delete command 
    await pool.query(
      "DELETE FROM todos WHERE id = $1",
      [id]
    );
    // 4. response 
    res.status(200).json({
      message: `Todo task with id: ${id} deleted successfully !`
    });
  
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// LogOut Route (Destroying Session)
// Goal:- Let the user log out- which means we destroy their session & remove all stored info.
app.post('/logout', (req,res) => {
  // destroy session 
  req.session.destroy((err) => {
    if(err){
      console.error('LogOut error: ', err);
      return res.status(500).json({
        message: "Logout failed !"
      });
    }
    // default cookie name 
    res.clearCookie("connect.sid");
    // response 
    res.json({
      message: "Logged out successfully !"
    });
  });
});