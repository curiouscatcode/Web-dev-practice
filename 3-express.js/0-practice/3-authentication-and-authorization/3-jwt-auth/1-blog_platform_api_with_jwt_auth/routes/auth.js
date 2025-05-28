// Goal:- JWT AUTH ROUTES
// - validate user input 
// - hash password (for security)
// - store users in DB
// - on login: create & send a JWT token
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');
const checkAuthor = require('../middleware/checkAuthor');
const checkCommenter = require('../middleware/checkCommenter');
// POST /signup
router.post('/signup', async (req, res)=> {
  // 1. req.body
  const { username, email, password } = req.body;
  // 2. edge case 01
  if(!username || !email || !password){
    return res.status(400).json({
      error: 'All fields required !'
    });
  }
  // try & catch
  try {
    // 3. edge case 02: check if user already exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({
        error: `Email: ${email} already exists !`
      });
    }
    // 4. Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

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

router.post('/login', async (req, res) => {
  // 1. req.body
  const { username ,email, password } = req.body;

  // 2. edge case01
  if(!username || !email || !password){
    return res.status(400).json({
      error: 'All fields required !'
    });
  }

  // try and catch 
  try {
    // 3. edge case02: check if user exists 
    const userRes = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if(userRes.rows.length === 0){
      return res.status(400).json({
        error: 'Invalid credentials !'
      });
    }

    // 4. extract user data 
    const user = userRes.rows[0];

    // 5. compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    // 6. If password does not match, return error
    if(!isMatch){
      return res.status(400).json({
        error: 'Invalid credentials !'
      });
    }

    // 7. create token 
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '1d'});

    // 8. response 
    res.status(200).json({
      message: 'LogIn Successfull !',
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// Create GET /profile (protected route)
router.get('/profile', requireAuth, async (req, res) => {
  try {
    // 1. Extract userId from JWT token 
    // (which is already added to req.user by requireAuth)
    const userId = req.user.id; 
    
    // 2. Global variable and select command 
    const result = await pool.query(
      "SELECT username, email FROM users WHERE id = $1",
      [userId]
    );

    // 3. If user not found, send error
    if(result.rows.length === 0){
      return res.status(400).json({
        error: 'User not found !'
      });
    }

    // 4. Send the user profile data as a response 
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// Create POST /posts (protected)
router.post('/posts', requireAuth, async (req, res) => {
  try {
    // 1. req.body
    const { title, content } = req.body;
    // 2. edge case 01 
    if(!title || !content){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // 3. extracting userId 
    const userId = req.user.id;

    // 4. global variable and insert command 
    const newPost = await pool.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, userId]
    );

    // 5. response 
    res.status(201).json({
      message: 'New post created !',
      post: newPost.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// Create GET /posts
// → Public route. Return a list of all blog posts
router.get('/posts', requireAuth, async (req, res) => { 
  try {
    // global variable and select query 
    const allPosts = await pool.query(
      "SELECT * FROM posts"
    );
    // edge case: if no post exists 
    if(allPosts.rows.length === 0){
      return res.status(400).json({
        error: 'No post exists !'
      });
    }
    // response 
    res.status(200).json({
      message: 'Here are all blog posts.',
      posts: allPosts.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// 🔍 Create GET /posts/:id
// → Public route. Return a single post by its ID.
router.get('/posts/:id', requireAuth, async (req, res) => {
  try {
    // 1. req.params: extracting query params
    const postId = parseInt(req.params.id);
    if(!postId){
      return res.status(400).send('Provide id Please !');
    }

    // 2. global variable and select query 
    const post = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );
    // 3. Check if post with certain id does not exists 
    if(post.rows.length === 0){
      return res.status(400).json({
        error: `Post with id: ${postId} does not exists !`
      });
    }

    // 4. response
    res.status(200).json(post.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// ✏️ Create PUT /posts/:id (protected)
// → Allow only the post's author to edit the post.
router.put('/posts/:id', requireAuth, checkAuthor, async (req, res) => {
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
    // 3. edge case 01 
    if(!title || !content){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // 4. extracting userId 
    const userId = req.user.id;
    console.log(userId);

    // 5. global variable and  update command
    const updatedBlog = await pool.query(
      "UPDATE posts SET title = $1, content = $2, user_id = $3 WHERE id = $4 RETURNING *",
      [title, content, userId, id]
    );

    // 6. response 
    res.status(200).json({
      message: `Post with id: ${id} updated successfully !`,
      updatedBlog: updatedBlog.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// 🗑️ Create DELETE /posts/:id (protected)
// → Allow only the post's author to delete the post.
router.delete('/posts/:id', requireAuth, checkAuthor, async (req, res) => {
  try {
    // 1. req.params 
    const id = parseInt(req.params.id);
    if(!id){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    } 
    // 2. delete command query
    await pool.query(
      "DELETE FROM posts WHERE id = $1",
      [id]
    );
    // 3. response 
    res.status(200).json({
      message: `Post with id: ${id} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Sever error'
    });
  }  
});

//  Create POST /posts/:id/comments (protected)
//  → Allow logged-in users to comment on a post.
router.post('/posts/:id/comments', requireAuth, async (req, res) => {
  try {
    // 1. req.params 
    const postId = parseInt(req.params.id);
    if(!postId){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // 2. req.body of comment
    const { comment } = req.body;
    if(!comment){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // edge case: if post does not exists 
    const postCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );
    if(postCheck.rows.length === 0){
      return res.status(400).json({
        error: `post with id: ${id} does not exists !`
      });
    }
    // 3. user_id
    const userId = req.user.id;
    // 4. global variable and insert command
    const newComment = await pool.query(
      "INSERT INTO comments (comment, post_id ,user_id) VALUES ($1, $2, $3) RETURNING *",
      [comment, postId, userId]
    );
    // 5. response 
    res.status(200).json({
      message: 'Comment added successfully !',
      comment: newComment.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

//  📄 Create GET /posts/:id/comments
//  → Public. Return all comments for a specific post.
router.get('/posts/:id/comments', async (req, res) => {
  try {
    // 1. req.params 
    const postId = parseInt(req.params.id);
    if(!postId){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // 2. edge case: check if post exists
    const postCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );
    if(postCheck.rows.length === 0){
      return res.status(400).json({
        error: `post with id: ${postId} does not exists !`
      });
    }  
    // 3. global variable and select command query 
    const comment = await pool.query(
      "SELECT * FROM comments WHERE id = $1",
      [postId]
    );
    // 4. response 
    res.status(200).json(comment.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// ✏️ Create PUT /comments/:id (protected)
// → Allow only the comment’s author to edit their comment.
router.put('/comments/:id', requireAuth, checkCommenter, async (req, res) => {
  try {
    // 1. req.params 
    const commentId = parseInt(req.params.id);
    if(!commentId){
      return res.status(400).json({
        error: 'CommentId is required !'
      });
    }
    // 2. edge case: check if comment exists or not
    const commentCheck = await pool.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentId]
    );
    if(commentCheck.rows.length === 0){
      return res.status(400).json({
        error: `post with id: ${commentId} does not exists !`
      });
    }  
    // 3. req.body
    const { comment } = req.body;
    if(!comment){
      return res.status(500).json({
        error: 'All fields required !'
      });
    }
    // 4. userId
    const userId = req.user.id;

    // 5. global variable and update command
    const updatedComment = await pool.query(
      "UPDATE comments SET comment = $1, user_id = $2 WHERE id = $3 RETURNING *",
      [comment, userId, commentId]
    );
    // 6. respone 
    res.status(200).json({
      message: `Comment with id: ${commentId} edited successfully !`,
      updatedComment: updatedComment.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// 🗑️ Create DELETE /comments/:id (protected)
//  → Allow only the comment’s author to delete their comment.
router.delete('/comments/:id', requireAuth, checkCommenter, async (req, res) => {
  try {
    // 1. req.params 
    const commentId = parseInt(req.params.id);
    if(!commentId){
      return res.status(400).json({
        error: 'Provide commentId'
      });
    }
    // 2. edge case: check if comment exists
    const commentCheck = await pool.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentId]
    );
    if(commentCheck.rows.length === 0){
      return res.status(400).json({
        error: `post with id: ${commentId} does not exists !`
      });
    }   
    // 3. Delete command 
    await pool.query(
      "DELETE FROM comments WHERE id = $1",
      [commentId]
    );
    // response 
    res.status(200).json({
      message: `Comment with id: ${commentId} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

module.exports = router;