const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');
const checkAuthor = require('../middleware/checkAuthor');
const checkCommenter = require('../middleware/checkCommenter');

// POST: /signup
router.post('/signup', async (req, res) => {
  try {
    // 1. req.body
    const { name, email, password } = req.body;
    // 2. edge case 01
    if(!name || !email || !password){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // 3. edge case check if user already exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({
        error: 'Email already registered !'
      });
    }

    // 4. Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert new user 
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
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
  const { name, email, password } = req.body;
  // 2. edge case 01
  if(!name || !email || !password){
    return res.status(400).json({
      error: 'All fields required !'
    });
  }   
  // try & catch 
  try {
    // 3. edge case02: check if user exists or not
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
    const user = userCheck.rows[0];

    // 5. compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    // 6. If password does not match, return error 
    if(!isMatch){
      return res.status(400).json({
        error: 'Invalid credentials !'
      });
    }

    // 7. Create token 
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '7d'});

    // 8. response 
    res.status(200).json({
      message: 'Login Successfull !',
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// POST /posts (protected)
// - Create a new post (content).
router.post('/posts', requireAuth, async (req, res) => {
  try {
    // 1. req.body
    const { content } = req.body;
    // 2. edge case 01
    if(!content){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // 3. get user_id 
    const userId = req.user.id;
    // 4. global variable and insert command
    const newPost = await pool.query(
      "INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *",
      [content, userId]
    );
    // 5. response 
    res.status(200).json({
      message: 'New post made successfully !',
      post: newPost.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// GET /posts
// - Get all posts (latest first).
router.get('/posts', async (req, res) => {
  try {
    // 1. edge case if any posts exists or not
    const postCheck = await pool.query(
      "SELECT * FROM posts"
    );
    if(postCheck.rows.length === 0){
      return res.status(400).json({
        error: 'No post exists !'
      });
    }    
    // 2. global variable and select command 
    const posts = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    // 3. response 
    res.status(200).json({
      message: 'Here are all posts in latest first order: ',
      posts: posts.rows 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /posts/:id
// - Get post by ID with author info and likes count.
router.get('/posts/:id', requireAuth, async (req, res) => {
  try {
    // 1. req.params 
    const postId = parseInt(req.params.id);
    if(!postId){
      return res.status(400).json({
        error: 'Please provide postId !'
      });
    }
    // 2. check if post with that id is exists or not
    const postCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );
    if(postCheck.rows.length === 0){
      return res.status(400).json({
        error: `Post with id: ${id} does not exists !`
      });
    }
    // 3. global variable and select command 
    const posts = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );
    // 4. response 
    res.status(200).json(posts.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// DELETE /posts/:id (only author)
// - Delete your own post.
router.delete('/posts/:id', requireAuth, checkAuthor, async (req, res) => {
  try {
    // 1. req.params 
    const postId = parseInt(req.params.id);
    if(!postId){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // No need of edge case of checking if post exists or not since it's done in checkAuthor middleware !
    
    // 2. delete command 
    await pool.query(
      "DELETE FROM posts WHERE id = $1",
      [postId]
    );
    // 3. response 
    res.status(200).json({
      message: `Post with id: ${postId} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// POST /posts/:id/like (protected)
// - Like or unlike a post (toggle).
// Also, add feature of like and dislike. 
// Steps:- 1. Check if the like already exists 
// 2. If it does exist, delete it (unlike)
// 3. If it does not exist, insert it (like)
router.post('/posts/:id/like', requireAuth, async (req, res) => {
  try {
      // 1. req.params extract params 
      const postId = parseInt(req.params.id);
      if(!postId){
        return res.status(400).json({
          error: 'Please provide id !'
        });
      }
      // 2. querying user_id 
      const userId = req.user.id;

      // 3. Check if post with given id exists or not 
      const postCheck = await pool.query(
        "SELECT * FROM posts WHERE id = $1",
        [postId]
      );
      if(postCheck.rows.length === 0){
        return res.status(400).json({
          error: `Post with id: ${postId} does not exists !`
        });
      }

      // 4. Check if like already exists 
      const likeCheck = await pool.query(
        "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
        [userId, postId]
      );

      if(likeCheck.rows.length > 0){
        // Unlike 
        await pool.query(
          "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
          [userId, postId]
        );
        return res.status(200).json({
          message: `User ${userId} unliked post ${postId}`
        });
      } else {
        // Like 
        // 4. global variable and insert command 
        const like = await pool.query(
          "INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *",
          [userId, postId]
        );

        // 5. response 
        res.status(200).json({
          message: `User with id: ${userId} liked post with id: ${postId} !`
        });
      }
    } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /posts/:id/likes
// - Get list of users who liked the post.
router.get('/posts/:id/likes', requireAuth, async (req, res) => {
  try {
    // 1. req.params extract params
    const postId = parseInt(req.params.id);
    if(!postId){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // 2. check if post with given id exists or not 
    const postCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );
    if(postCheck.rows.length === 0){
      return res.status(400).json({
        error: `Post with id: ${postId} does not exists !`
      });
    }
    // 3. Check if like already exists
    const likeCheck = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );
    if(likeCheck.rows.length > 0){
      // Unlike: delete the like 
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
        [userId, postId]
      );
    }
    // 3. global variable and select command query 
    const allLikes = await pool.query(
      "SELECT * FROM likes WHERE post_id = $1",
      [postId]
    );
    // edge case: if no like under post 
    if(allLikes.rows.length === 0){
      return res.status(400).json({
        error: `No like under post with id: ${postId} !`
      });
    }
    // 4. response 
    res.status(200).json({
      message: `Here are all likes under post with id: ${postId}:`,
      likes: allLikes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// POST /posts/:id/comments (protected)
// - Add comment to post.
router.post('/posts/:id/comments', requireAuth, async (req, res) => {
  try {
    // 1. req.params (extract params query)
    const postId = parseInt(req.params.id);
    if(!postId){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // 2. req.body
    const comment = req.body;
    if(!comment){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // 3. check if post with given id exists or not 
    const postCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );
    if(postCheck.rows.length === 0){
      return res.status(400).json({
        error: `Post with id: ${postId} does not exists !`
      });
    }
    // 4. extracting userId with req.user
    const userId = req.user.id;

    // 5. global variable and insert command 
    const newComment = await pool.query(
      "INSERT INTO comments (comment, user_id, post_id) VALUES ($1, $2, $3) RETURNING *",
      [comment, userId, postId]
    );
    // 6. response 
    res.status(200).json(newComment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /posts/:id/comments
// - List all comments on a post.
router.get('/posts/:id/comments', requireAuth, async (req, res) => {
  try {
    // 1. req.params 
    const postId = parseInt(req.params.id);
    if(!postId){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    // 2. check if comment exists or not
    const checkComment = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1",
      [postId]
    );
    if(checkComment.rows.length === 0){
      return res.status(400).json({
        error: `No comment exists under post_id: ${postId}`
      })
    }
    // 3. global variable and select command 
    const comments = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1",
      [postId]
    );
    // 4. response 
    res.status(200).json(comments.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// DELETE /comments/:id (only author)
// - Delete own comment.
router.delete('/comments/:id', requireAuth, checkCommenter, async (req, res) => {
  try {
    // 1. req.params 
    const commentId = parseInt(req.params.id);
    if(!commentId){
      return res.status(400).json({
        error: 'Please provide commentId !'
      });
    }
    // 2. Check if comment exists or not is not needed since it is checkCommenter 
    
    // 3. delete command
    await pool.query(
      "DELETE FROM comments WHERE id = $1",
      [commentId]
    );
    // 4. response 
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