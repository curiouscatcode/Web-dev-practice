const express = require('express');
const pool = require('./db');

const router = express.Router();

// 1. Create a new order (Create)
// a. define the route
router.post('/orders', async (req,res) => {
  try {
    // b. req.body
    const { customer_name, product_name, quantity, status } = req.body;
    // c. edge case 
    if(!customer_name || !product_name || !quantity ){
      return res.status(404).send('Please provide all the required things !');
    }
    // d. Global variable and insert command 
    const newOrder = await pool.query("INSERT INTO orders (customer_name, product_name, quantity, status) VALUES ($1, $2, $3, $4) RETURNING * ",
      [customer_name, product_name, quantity, status]
    );
    // e. response 
    res.status(200).json(newOrder.rows[0]);
  } catch (err) { 
    // f. console error and response error
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 2. Get all the user (READ)
// a. Define the route
router.get('/orders', async (req,res) => {
  try {
    // b. extract the query
    const { customer_name, status, sort } = req.query;
    // c. base query 
    let query = "SELECT * FROM orders";
    let values = [];
    let conditions = [];

    // d. filtering 
    if(customer_name !== undefined){
      conditions.push(` customer_name ILIKE $${values.length + 1}`);
      values.push(`%${customer_name}%`);
    }

    if(status !== undefined){
      conditions.push(` status ILIKE $${values.length + 1}`);
      values.push(`%${status}%`);
    }

    // e. joining
    if(conditions.length > 0){
      query += " WHERE " + conditions.join(" AND ");
    }

    // f. sorting (if sort parameter exists)
    if(sort === "asc"){
      query += " ORDER BY created_at ASC";
    } else if(sort === "desc"){
      query += " ORDER BY created_at DESC";
    }

    // global variable and select command 
    const allOrders = await pool.query(query, values);
    //  response 
    res.status(200).json(allOrders.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// Get user by ID 
// a. Define the route
router.get('/orders/:id', async (req,res) => {
  try {
    // b. req.params 
    const { id } = req.params;
    // c. global variable and select command 
    const order = await pool.query("SELECT * FROM orders WHERE id = $1", 
      [id]
    );
    // d. edge case 
    if(order.rows.length === 0){
      return res.status(400).send(' Order not found !');
    }
    // e. response 
    res.status(200).json(order.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// Update the order (UPDATE)
// a. define the route
router.put('/orders/:id', async (req,res) => {
  try {
    // b. req.params
    const { id } = req.params;
    const { customer_name, product_name, quantity, status } = req.body;

    // c. edge case 
    if (!customer_name || !product_name || !quantity || !status){
      return res.status(404).send('Please provide all the required fields: customer_name, product_name, quantiy, status');
    }

    // d. global variable and Update command 
    const updatedOrder = await pool.query("UPDATE orders SET customer_name = $1, product_name = $2, quantity = $3, status = $4 WHERE id = $5 RETURNING *", 
      [customer_name, product_name, quantity, status, id]
    );

    // e. response 
    res.status(200).json(updatedOrder.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// Delete an order (DELETE)
// a. define the route 
router.delete('/orders/:id', async (req,res) => {
  try {
    // b. req.params
    const { id } = req.params;
    // c. delete command 
    await pool.query("DELETE FROM orders WHERE id = $1", 
      [id]
    );
    // d. response 
    res.status(200).json({
      message: `Order with id: ${id} deleted successfully !`
  }); 
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error !');
  }
});

module.exports = router;