const express = require('express');
const pool = require('./db');

const router = express.Router();

// 1. Create a user (POST)
// - `POST /register` – Register new user
router.post('/register', async (req,res) => {
  try {
    // req.body
    const { name, email, password } = req.body || {};
    // edge case 
    if(!name || !email || !password){
      return res.status(400).send('Please provide name, email and password !');
    }
    // global variable and insert command 
    const newRegister = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    // response 
    res.status(200).json(newRegister.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// - `POST /expenses` – Add new expense 
router.post('/expense', async (req,res) => {
  try {
    // req.body
    const { user_id, title, amount, category, date } = req.body || {};
    // edge case
    if(!user_id || !title || !amount || !category || !date){
      return res.status(400).send('Please provide user_id, title, amount, category, date !');
    }
    // global variable and insert command 
    const newExpense = await pool.query("INSERT INTO expense (user_id, title, amount, category, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, title, amount, category, date]
    );
    // response 
    res.status(200).json(newExpense.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 2. Get expense as per users
// - `GET /expenses` – Get all expenses as per user
router.get('/users/:user_id/expense', async (req,res) => {
  try {
    // req.params
    const  user_id  = parseInt(req.params.user_id);
    // edge case
    if(isNaN(user_id)){
      return res.status(400).send('User_id should be a positive integer !');
    }
    if(!user_id){
      return res.status(400).send('Please provide user_id !');
    } 
    // global variable and select command
    const expense = await pool.query("SELECT * FROM expense WHERE user_id = $1",
      [user_id]
    );
    // response 
    res.status(200).json(expense.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// - `GET /expenses/:id` – Get single expense
router.get('/expense/:id', async (req,res) => {
  try {
    // req.params
    const id = parseInt(req.params.id);
    // edge case
    if(isNaN(id)){
      return res.status(400).send(`Id: ${id} is not a positive integer !`);
    }
    if(!id){
      return res.status(400).send(`Id: ${id} does not exists !`);
    }
    // global variable and select command 
    const expenseById = await pool.query("SELECT * FROM expense WHERE id = $1",
      [id]
    );
    // response 
    res.status(200).json(expenseById.rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// 3. Update an expense 
// - `PUT /expenses/:id` – Update an expense
router.put('/users/:user_id/expense/:id', async (req,res) => {
  try {
    // req.params 
    const userId = parseInt(req.params.user_id);
    const id = parseInt(req.params.id);

    // edge case 
    if(isNaN(userId) || isNaN(id)){
      return res.status(400).send('Enter valid user_id and id !');
    }
    if(!userId || !id){
      return res.status(400).send('Please provide user_id and id !');
    }

    // req.body
    const { user_id, title, amount, category, date } = req.body;
    // edge case for req.body
    if(!user_id || !title || !amount || !category || !date){
      return res.status(400).send('Please provide all the required fields: user_id, title, amount, category, date !');
    }

    // global variable and update command 
    const updatedExpense = await pool.query("UPDATE expense SET user_id = $1, title = $2, amount = $3, category = $4, date = $5 WHERE id = $6 AND user_id = $7 RETURNING *",
      [user_id, title, amount, category, date, id, userId]
    );
    // response 
    res.status(200).json(updatedExpense.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// 4. Delete an expense
// - `DELETE /expenses/:id` – Delete an expense
router.delete('/expense/:id', async (req,res) => {
  try {
    // req.params 
    const id = parseInt(req.params.id);
    // edge case
    if(isNaN(id) || !id){
      return res.status(400).send('Enter valid id !');
    }
    // delete command 
    await pool.query("DELETE FROM expense WHERE id = $1",
      [id]
    );
    // response 
    res.status(200).json({
      message: `Expense with id: ${id} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
})

module.exports = router;