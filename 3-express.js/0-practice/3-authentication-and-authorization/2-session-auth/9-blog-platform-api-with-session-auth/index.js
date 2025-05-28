const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { ErrorWithReasonCode } = require('mqtt');
const { parse } = require('dotenv');
require('dotenv').config();

const app = express();
const port = 5000;

// psql pool setup
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL,
});

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware (session object)
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
  res.send('Blog Platform Session Auth Server is running !');
});

// Start server 
app.listen(port, () => {
  console.log(`Server is started on http://localhost:${port}`);
});

// SignUp Route
// Goal:- Create a /signup post route
// - Get username, password from the request
// - Hash the password using bcryptjs
// - save user into users table
app.post('/signup', async (req,res) => {
  // 1. req.body
  const { username, password } = req.body;
  // 2. edge case 01
  if(!username || !password){
    return res.status(400).json({
      error: 'All fields required !'
    });
  }  
  // 3. try & catch 
  try {
    // 4. edge case 02: check if user already exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({
        error: 'Username already exists !'
      });
    }

    // 5. hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Insert into DB 
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hashedPassword]
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

// Login with session based auth
// Goal:- When a user logs in:-
// - Verify their credentials 
// - create a session 
// - save their info in the session 
app.post('/login', async (req,res) => {
  // 1. req.body
  const { username, password } = req.body;
  // 2. edge case 01
  if(!username || !password){
    return res.status(400).json({
      error: 'All fields required !'
    });
  }
  try {
    // 3. edge case 02: check if userExists 
    const userCheck = await pool.query(
      "SELECT * FROM  users WHERE username = $1",
      [username]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        message: 'User not found !'
      });
    }
    // 4. global variable 
    const user = userCheck.rows[0];
    // 5. compare the password using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        message: 'Invalid credentials !'
      });
    }
    // 6. create session 
    req.session.userId = user.id;
    req.session.username = user.username;
    // 7. response 
    res.status(200).json({
      message: 'LogIn Successful !'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server  error !'
    });
  }
});

// Protected Route
// Middleware to check authentication 
function requireLogin(req, res, next) {
  if(!req.session.userId){
    return res.status(401).json({
      message: 'Unauthorized. Please LogIn.'
    });
  }
  next();
}

// POST /posts – Create a blog post (only if logged in)
app.post('/posts', requireLogin, async (req,res) => {
  try {
    // 1. req.body
    const { title, content } = req.body;
    // 2. edge case 01 
    if(!title || !content){
      return res.status(500).json({
        error: 'All fields required !'
      });
    }
    // 3. userId from req.session
    const userId = req.session.userId; 
    // 4. global variable and insert command
    const newBlog = await pool.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, userId]
    );
    // 5. response 
    res.status(201).json(newBlog.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server Error !'
    });
  }  
});

// GET /posts – Get all posts
app.get('/posts', async (req,res) => {
  try {
    // edge case: if no post exists 
    const blogCheck = await pool.query(
      "SELECT * FROM posts"
    );
    if(blogCheck.rows.length === 0){
      return res.status(400).json({
        message: 'Posts does not exists !'
      });
    }
    // global variable and select command 
    const allBlogs = await pool.query(
      "SELECT * FROM posts"
    );
    // response 
    res.status(200).json(allBlogs.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /posts/:id – Get a single post by ID
app.get('/posts/:id', async (req,res) => {
  try {
    // req.params 
    const id = parseInt(req.params.id);
    if(!id){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // if blog with given id does not exists 
    const blogCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [id]
    );
    if(blogCheck.rows.length === 0){
      return res.status(400).json({
        error: `Blog with id: ${id} does not exists !`
      });
    }
    // global variable and select command 
    const blog = await pool.query(
      "SELECT * FROM posts WHERE id = $1", 
      [id]
    );
    // response 
    res.status(200).json(blog.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server Error !'
    });
  }
});

// PUT /posts/:id – Update a post (only if logged in and author)
// middleware to checkAuthor 
async function checkAuthor(req, res, next) {
  // 1. extract req.params 
  const id = parseInt(req.params.id);
  // 2. Query user_id from the database
  const userId = await pool.query(
    "SELECT user_id FROM posts WHERE id = $1",
    [id]
  );
  // 3. check if post exists 
  const postCheck = await pool.query(
    "SELECT * FROM posts WHERE id = $1",
    [id]
  );
  if(postCheck.rows.length === 0){
    return res.status(400).json({
      message: `Post with id: ${id} does not exists !`
    });
  }  
  // extract the author id from result 
  const postAuthorId = userId.rows[0].user_id;

  // compare user_id with req.session.id
  if(postAuthorId !== req.session.userId){
    return res.status(403).json({
      error: 'Unauthorized. You are not the author of this post so you cannot edit !'
    });
  }
  next();
}

app.put('/posts/:id', requireLogin, checkAuthor, async (req, res) => {
  try {
    // 1. req.params 
    const id = parseInt(req.params.id);
    if(!id){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // 2. req.body
    const { title, content } = req.body;
    // edge case 01
    if(!title || !content){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // edge case 02: check if blog exists or not
    const blogCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [id]
    );
    if(blogCheck.rows.length === 0){
      return res.status(400).json({
        error: `Post with id: ${id} does not exists !`
      });
    }
    // 3. global variable and update command 
    const updatedBlog = await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, id]
    );
    // response 
    res.status(200).json(updatedBlog.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server Error !'
    });
  }  
});

// DELETE /posts/:id – Delete a post (only if logged in and author)
app.delete('/posts/:id', requireLogin, checkAuthor, async (req, res) => {
  try {
    // req.params
    const id = parseInt(req.params.id);
    if(!id){
      return res.status(400).json({
        error: 'Server error !'
      });
    }
    // edge case:- check if posts exists or not
    const postCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [id]
    );
    if(postCheck.rows.length === 0){
      return res.status(400).json({
        error: `Post with id: ${id} does not exists !`
      });
    }
    // delete command
    await pool.query(
      "DELETE FROM posts WHERE id = $1",
      [id]
    );
    // response 
    res.status(200).json({
      message: `Post with id: ${id} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// POST /posts/:id/comments – Add a comment to a post (only if logged in)
app.post('/posts/:id/comments', requireLogin, async (req, res) => {
  try {
    // 1. req.params 
    const postId = parseInt(req.params.id);
    if(!postId){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }

    // edge case: check if post exists or not 
    const postCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );
    if(postCheck.rows.length === 0){
      return res.status(400).json({
        error: `Post with id: ${postId} does not exists !`
      });
    }
    // 2. req.body
    const { comment } = req.body;
    if(!comment){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // 3. req.session
    const userId = req.session.userId;

    // 4. global variable and insert command 
    const newComment = await pool.query(
      "INSERT INTO comments (comment, user_id, post_id) VALUES ($1, $2, $3) RETURNING *",
      [comment, userId, postId]
    );
    // 5. response 
    res.status(201).json(newComment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server Error !'
    });
  }  
});

// GET /posts/:id/comments – Get all comments on a post
app.get('/posts/:id/comments', requireLogin, async (req, res) => {
  try {
    // req.params
    const postId = parseInt(req.params.id);
    if(!postId){
      return res.status(400).json({
        error: 'Please provide postid !'
      });
    } 
    // check if comment exists or not 
    const checkComment = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );
    if(checkComment.rows.length === 0){
      return res.status(400).json({
        error: `Comment under post: ${postId} does not exists !`
      });
    }
    // global variable and select command 
    const comment = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1",
      [postId]
    );
    // response 
    res.status(200).json(comment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// DELETE /comments/:id – Delete a comment (only if logged in and author)
app.delete('/comments/:id', requireLogin, checkAuthor, async (req, res) => {
  try {
    // 1. req.params 
    const commentId = parseInt(req.params.id);
    // edge case 01
    if(!commentId){
      return res.status(400).json({
        error: 'Provide comment id !'
      });
    }
    // 2. check if comment exists or not 
    const checkComment = await pool.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentId]
    );
    if(checkComment.rows.length === 0){
      return res.status(400).json({
        error: `comment with id: ${commentId} does not exists !`
      });
    }
    // delete command
    await pool.query(
      "DELETE FROM comments WHERE id = $1",
      [commentId]
    );
    // response 
    res.status(400).json({
      message: `Comment with id: ${commentId} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// LogOut Route
app.post('/logout', (req, res) => {
  // destroy 
  req.session.destroy((err) => {
    if(err) {
      console.error('Logout error: ', err);
      return res.status(500).json({
        message: 'Logout failed !'
      });
    }
    // default cookie name
    res.clearCookie('connect.sid');
    // response 
    res.json({
      message: 'Logged out successfully !'
    });
  });
});