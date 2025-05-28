const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = 3000;

// PSQL pool setup 
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware: session-object
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
  res.send('Fake Wallet Server is running !');
});

// Start Server 
app.listen(port, () => {
  console.log(`Server is started on http://localhost:${port}`);
});

// SignUp Route 
// Goal:- - Create a /signup post route.
// - get username, password from the request.
// - hash the password using bcryptjs.
// - save user into users table.
app.post('/signup', async (req,res) => {
  // 1. req.body
  const { name, password } = req.body;
  // 2. edge case
  if(!name || !password){
    return res.status(400).json({
      error: 'All fields required.'
    });
  }  
  // 3. try & catch 
  try {
    // 4. edge case 2 - check if user already exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [name]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({
        error: `User with name: ${name} already exists !` 
      });
    } 
    // 5. hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Insert into DB 
    await pool.query(
      "INSERT INTO users (name, password) VALUES ($1, $2)",
      [name, hashedPassword]
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

// LogIn with session based Auth 
// Goal:- When user logs in:-
// - verify their credentials
// - create a session 
// - save their info in the session
app.post('/login', async (req,res) => {
  // 1. req.body
  const { name, password } = req.body;
  // 2 edge case 
  if(!name || !password){
    return res.status(400).json({
      error: 'All fields required !'
    });
  }  
  try {
    // 3. Check if user exists 
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [name]
    );
    if(userCheck.rows.length === 0){
      return res.status(400).json({
        message: `User with name: ${name} not found !`
      });
    }
    // 4. global variable user 
    const user = userCheck.rows[0];

    // 5. compare the password using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }

    // 6. create a session 
    req.session.userId = user.id;
    req.session.username = user.name;

    // 7. response 
    res.status(200).json({
      message: 'LogIn Successful !'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    })
  }
});

// Protected Routes (Authorization)
// Middleware to check Authentication 
function requireLogin (req, res, next){
  if(!req.session.userId){
    return res.status(401).json({
      message: 'Unauthorized. Please Log In.'
    });
  }
  next();
}

// Create Protected Route For different routes.
app.post('/transactions', requireLogin, async (req,res) => {
  try {
    // 1. req.body
    const { type, amount, note } = req.body;
    // 2. edge case 
    if(!type || !amount){
      return res.status(401).send('Type and amount are must.');
    }  
    if(type !== 'add' && type !== 'remove'){
      return res.status(400).send('Type can have only two inputs: add and remove.');
    }
    // 3. userId 
    const userId = req.session.userId;
    // 4. global variable and insert command 
    const newTransaction = await pool.query(
      "INSERT INTO transactions (user_id, type, amount, note) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, type, amount, note]
    );
    // 5. response 
    res.status(201).json(newTransaction.rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// GET /transactions
app.get('/transactions', requireLogin, async (req,res) => {
  try {
    // global variable and select command 
    const allTransaction = await pool.query(
      "SELECT * FROM transactions "
    );
    // response 
    res.status(200).json({
      transactions: allTransaction.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
})

// Delete a transaction (DELETE /transactions/:id)
app.delete('/transactions/:id', requireLogin, async (req,res) => {
  try {
    // req.params 
    const id = parseInt(req.params.id);
    // edge case 
    if(!id){
      return res.status(400).send('Id is required !');
    }
    if(isNaN(id)){
      return res.status(400).send('Id should be a positive integer !');
    }
    // delete command 
    await pool.query(
      "DELETE FROM transactions WHERE id = $1",
      [id]
    );
    // response 
    res.status(200).json({
      message: `Transaction with id: ${id} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// Balance Calculation
// Create a route: GET/balance
//  → Returns current wallet balance (sum of transactions).
//  → Automatically calculate by summing add and remove transactions.
app.get('/balance', requireLogin, async (req,res) => {
  try {
    // userId
    const userId = req.session.userId;

    // global variable & select command 
    const result = await pool.query(`
        SELECT COALESCE (SUM(
          CASE
            WHEN type = 'add' THEN amount 
            WHEN type = 'reove' THEN -amount
            ELSE 0
          END
        ), 0) AS balance
        FROM transactions 
        WHERE user_id = $1;
      `, [userId]
    );
  
    // response 
    res.status(200).json({
      balance: result.rows[0].balance
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// Logout Route (Destroying Session)
// Goal:- Let the user log out which means we destroy their session and remove all stored info.
app.post('/logout', (req,res) => {
  // destroy
  req.session.destroy((err) => {
    if(err){
      console.error('Logout error: ', err);
      return res.status(500).json({
        message: 'Logout failed !'
      });
    }
    // Default cookie name 
    res.clearCookie('connect.sid');
    // response 
    res.json({
      message: 'Logged Out successfully !'
    });
  });
});