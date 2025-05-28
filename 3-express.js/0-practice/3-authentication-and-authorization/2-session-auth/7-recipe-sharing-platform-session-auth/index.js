const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { connect } = require('mqtt');
const { configDotenv } = require('dotenv');
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

// Middleware: session object 
app.use(
  session ({
    secret: 'secret-key', // use a secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true only if using HTTPS
  })
);

// Test Route 
app.get('/', (req,res) => {
  res.send('Recipe Sharing Platform is running !');
});

// Start server
app.listen(port, () => {
  console.log(`Server is started on http://localhost:${port}`);
});

// SignUp Route 
// Goal:- - Create a /signup post route 
// - get username, password, email from request
// - hash the password using bcryptjs
// - save user into users table
app.post('/signup', async (req,res) => {
  // 1. req.body
  const { username, password, email } = req.body;
  // 2. edge case 
  if(!username || !password || !email){
    return res.status(400).json({
      error: 'All fields required !'
    });
  }
  // 3. try & catch 
  try {
    // 4. check if user already exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
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
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );
    // 7. response 
    res.status(201).json({
      message: 'SignUp successfull !'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// LogIn with Session based Auth
// Goal:- When user logs in:-
// - Verify their credentials
// - create a session 
// - save their info in the session
app.post('/login', async (req,res) => {
  try {
    // 1. req.body
    const { username, email, password } = req.body;
    // 2. edge csse 
    if(!username || !email || !password){
      return res.status(401).json({
        error: 'All fields required !'
      });
    }  
    // 2. b. check if userExists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        message: 'User not found !'
      });
    }
    // 3. global varibale : user
    const user = userCheck.rows[0];

    // 4. compare the password using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        message: 'Invalid Credentials !'
      });
    }

    // 5. Create session 
    req.session.userId = user.id;
    req.session.username = user.username;

    // 6. response 
    res.status(200).json({
      message: 'LogIn successfull !'
    }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }
});

// Protected Routes (Authorization)
// Middleware to check authentication
function requireLogin (req, res, next) {
  if(!req.session.userId){
    return res.status(400).json({
      message: 'Unauthorized. Please log in.'
    });
  }
  next();
}

// Create Protected Routes
// POST /recipes – Submit a new recipe (only accessible if the user is logged in).
app.post('/recipes', requireLogin, async (req,res) => {
  try {
    // 1. req.body
    const { name, ingredients, steps } = req.body;

    // 2. edge case
    if(!name || !ingredients || !steps){
      return res.status(401).json({
        error: 'All fields required !'
      });
    }
    // 3. if recipe already exists 
    const userCheck = await pool.query(
      "SELECT * FROM recipes WHERE name = $1", 
      [name]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({
        message: `Recipe with name: ${name} already exists !`
      });
    }

    // 3.b. userId for author_id
    const userId = req.session.userId;

    // 4. global variable and insert command 
    const newRecipe = await pool.query(
      "INSERT INTO recipes (name, ingredients, steps, author_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, ingredients, steps, userId]
    );
    // 5. response 
    res.status(201).json(newRecipe.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error !'
    });
  }  
});

// GET /recipes – Get a list of all recipes.
app.get('/recipes', requireLogin, async (req,res) => {
  try {
    // global variable and select command 
    const allRecipes = await pool.query(
      "SELECT * FROM recipes"
    );
    // response 
    res.status(200).json(allRecipes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /recipes/:id – Get details of a specific recipe
app.get('/recipes/:id', requireLogin, async (req,res) => {
  try {
    // req.params 
    const id = parseInt(req.params.id);
    // edge case
    if(!id){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }
    if(isNaN(id)){
      return res.status(400).send(`Id : ${id} is not positive integer.`);
    }
    // global variable and select command 
    const recipe = await pool.query(
      "SELECT * FROM recipes WHERE id = $1",
      [id]
    );
    // edge case: if recipe does not exists
    if(recipe.rows.length === 0){
      return res.status(400).json({
        error: `Recipe with id: ${id} does not exists !`
      });
    }
    // response 
    res.status(200).json(recipe.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// PUT /recipes/:id – Edit a recipe (only accessible by the user who submitted it).
// Middleware: check if the logged-in user is the author of the recipe
async function checkRecipeOwnership(req, res, next) {
  // req.params  
  const recipeId = req.params.id;
  const userId = req.session.userId;

  try {
    // global variable and select command
    const recipe = await pool.query(
      "SELECT * FROM recipes WHERE id = $1",
      [recipeId]
    );

    if(recipe.rows.length === 0){
      return res.status(404).json({
        message: 'Recipe not found !'
      });
    }

    if(recipe.rows[0].author_id !== userId){
      return res.status(403).json({
        message: 'You are not authorized to perform this action.'
      })
    }

    // attach recipe info to request if needed later
    req.recipe = recipe.rows[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error !'
    });
  }
}

app.put('/recipes/:id', requireLogin, checkRecipeOwnership, async (req,res) => {
  try {
    // req.body
    const { name, ingredients, steps } = req.body;
    // req.params
    const id = parseInt(req.params.id);
    // edge case-01
    if(!name || !ingredients || !steps){
      return res.status(400).json({
        error: 'All fields are required !'
      });
    }
    if(!id){
      return res.status(400).json({
        error: 'Please provide id !'
      });
    }

    // global variable and update command 
    const updatedRecipe = await pool.query(
      "UPDATE recipes SET name = $1, ingredients = $2, steps = $3 WHERE id = $4 RETURNING *",
      [name, ingredients, steps, id]
    );

    // response 
    res.status(200).json(updatedRecipe.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// DELETE /recipes/:id – Delete a recipe (only accessible by the user who submitted it).
app.delete('/recipes/:id', requireLogin, checkRecipeOwnership, async (req,res) => {
  try {
    // req.params
    const id = parseInt(req.params.id);
    // edge case
    if(!id){
      return res.status(400).json({ error: 'Id should be given.'});
    }
    // edge case 02: check if recipe with given id exists or not. 
    const recipeCheck = await pool.query(
      "SELECT * FROM recipes WHERE id = $1", [id]
    );
    if(recipeCheck.rows.length === 0){
      return res.status(400).json({
        message: `Recipe with id: ${id} does not exists !`
      });
    }
    // delete command 
    await pool.query(
      "DELETE FROM recipes WHERE id = $1",
      [id]
    );
    // response 
    res.status(200).json({
      message: `Recipe with id: ${id} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error !'});
  }
});

// POST /recipes/:id/like – Like a recipe.
app.post('/recipes/:id/like', requireLogin, async (req,res) => {
  try {
    // req.params 
    const recipeId = parseInt(req.params.id);
    const userId = req.session.userId;
    // edge case
    if(!recipeId){
      return res.status(400).json({ error: 'Provide recipeId please !'});
    }
    // check if user already liked this recipe
    const existingLike = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND recipe_id = $2",
      [userId, recipeId]
    );
    if(existingLike.rows.length > 0){
      // If exists -> toggle like status
      const currentStatus = existingLike.rows[0].like_status;
      const updateLike = await pool.query(
        "UPDATE likes SET like_status = $1 WHERE user_id = $2 AND recipe_id = $3 RETURNING *",
        [!currentStatus, userId, recipeId]
      );
      return res.status(200).json({
        message: `Recipe ${!currentStatus ? 'liked' : 'unliked'}.`,
        like: updateLike.rows[0]
      });
    } else {
      // If not liked before → insert new like
      const newLike = await pool.query(
        "INSERT INTO likes (user_id, recipe_id, like_status) VALUES ($1, $2, $3) RETURNING *",
        [userId, recipeId, true]
      );
      return res.status(201).json({ message: 'Recipe liked.', like: newLike.rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error !'});
  }
});

// POST /recipes/:id/comment – Add a comment to a recipe.
app.post('/recipes/:id/comment', requireLogin, async (req,res) => {
  try {
    // req.params 
    const recipeId = parseInt(req.params.id);
    const userId = req.session.userId;
    // edge cases
    if(!recipeId){
      return res.status(400).json({ error: 'Please provide id'});
    }
    // check if recipe exists 
    const recipeCheck = await pool.query(
      "SELECT * FROM recipes WHERE id = $1",
      [recipeId]
    );
    if(recipeCheck.rows.length == 0){
      return res.status(400).json({ error: `Recipe with id: ${recipeId} does not exists! Kiske niche comment kar raha hai tu !`});
    }

    // req.body
    const comment = req.body;
    if(!comment){
      return res.status(400).json({
        error: 'Comment is must. Cannot be empty.'
      });
    }
    // global variable and insert command 
    const newComment = await pool.query(
      "INSERT INTO comments (recipe_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *",
      [recipeId, userId, comment]
    );
    // response 
    res.status(200).json(newComment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error !'});
  }  
});

// DELETE /comments/:id – Delete a comment (only accessible by the user who posted it).
// this task will need a new middleware : checkCommentOwnership
async function checkCommentOwnership(req,res,next) {
  const commentId = parseInt(req.params.id);
  const userId = req.session.userId;
  
  const comment = await pool.query(
    "SELECT * FROM comments WHERE id = $1",
    [commentId]
  );

  if(comment.rows.length === 0){
    return res.status(404).json({
      error: 'Comment not found !'
    });
  }

  if(comment.rows[0].user_id !== userId){
    return res.status(403).json({
      error: 'You are not authorized to delete this comment.'
    });
  }
  next();
}

app.delete('/comments/:id', requireLogin, checkCommentOwnership, async (req,res) => {
  try {
    const commentId = parseInt(req.params.id);

    // edge case
    if(!commentId){
      return res.status(400).json({ error: 'Please provide recipeId !'});
    }
    // check if comment with this id exists or not
    const commentExists = await pool.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentId]
    );
    if(commentExists.rows.length === 0){
      return res.status(400).json({ 
        error: `Comment with id: ${commentId} does not exists !`
      });
    }
    // delete command 
    await pool.query(
      "DELETE FROM comments WHERE id = $1",
      [commentId]
    );
    // response 
    res.status(200).json({
      message: `Comment by id: ${commentId} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server Error !'
    });
  }  
});

// LogOut Route (Destroy Session)
// Goal:- Let the user log out- which means we destroy their session & remove all stored info.
app.post('/logout', (req,res) => {
  // destroy
  req.session.destroy((err) => {
    if(err){
      console.error("Logout error: ", err);
      return res.status(500).json({
        message: 'Logout failed !'
      });
    }
    // default cookie name 
    res.clearCookie('connect.sid');
    // response 
    res.json({
      message: 'Logged out successfull !'
    });
  });
});