const express = require('express');
const pool = require('./db');

const router = express.Router();

// 1. create an item in menu (CREATE)
router.post('/menu-items', async (req,res) => {
  try {
    // req.body
    const { name, price } = req.body || {};
    /// edge case 
    if(!name || !price){
      return res.status(400).send('Please provide both \'name\' and \'price\' !');
    }
    // global variable and insert command 
    const newItem = await pool.query("INSERT INTO menu_items (name, price) VALUES ($1, $2) RETURNING *", 
      [name, price]
    );
    // response 
    res.status(200).json(newItem.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 2.a. Get all items from menu_items (READ)
router.get('/menu-items', async (req,res) => {
  try {
    // global variable and select command 
    const allItems = await pool.query("SELECT * FROM menu_items");
    // response 
    res.status(200).json(allItems.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 2.b. Get item from menu_items with an id (READ)
router.get('/menu-items/:id', async (req,res) => {
  try {
    // req.params
    const id = parseInt(req.params.id);
    
    // edge case 
    if(isNaN(id) || id <= 0){
      return res.status(400).send(`Id: ${id} should be a positive integer !`);
    }
    if(!id){
      return res.status(400).send('Please provide id to get a specific item from the menu_item');
    }

    // global variable and select command 
    const item = await pool.query("SELECT * FROM menu_items WHERE id = $1", 
      [id]
    );

    if(item.rows.length === 0){
      return res.status(404).send('User not found !');
    }
    // response 
    res.status(200).json(item.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

router.put('/menu-items/:id', async (req,res) => {
  try {
    // req.params
    const id = parseInt(req.params.id);

    // req.body
    const { name, price } = req.body || {};

    // edge case 
    if(isNaN(id) || id <= 0){
      return res.status(400).send(`Id: ${id} should be positive integer !`);
    }
    if(!id){
      return res.status(400).send('Please provide id !');
    }

    // global variable and update command 
    const updatedItem = await pool.query("UPDATE menu_items SET name = $1, price = $2 WHERE id = $3 RETURNING *", 
      [name, price, id]
    );

    // edge case of not existing 
    if(updatedItem.rows.length === 0){
      return res.status(400).send('User not found !');
    }
    // response 
    res.status(200).json(updatedItem.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

router.delete('/menu-items/:id', async (req,res) => {
  try {
    // req.params
    const id = parseInt(req.params.id);

    // edge case 
    if(isNaN(id) || id <= 0){
      return res.status(400).send('Id should be a positive integer !');
    }

    // delete command 
    await pool.query("DELETE FROM menu_items WHERE id = $1", 
      [id]
    );

    // response 
    res.status(200).json({
      message: `Item with id: ${id} was successfully deleted !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

//   5. Read all the orders (READ) (GET)
router.get('/orders', async (req,res) => {
  try {
    // global variable and select command 
    const orders = await pool.query("SELECT * FROM orders");
    // edge case 
    if(orders.rows.length === 0){
      return res.status(400).send('Order not found !');
    }
    // response 
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

//   6. Add data in order_items table (POST)
router.post('/orders', async (req, res) => {
  try {
    const { customer_name, items } = req.body;

    if (!customer_name || !Array.isArray(items)) {
      return res.status(400).send('Provide customer_name and items[]');
    }

    // Step 1: Insert order
    const orderResult = await pool.query(
      'INSERT INTO orders (customer_name) VALUES ($1) RETURNING *',
      [customer_name]
    );
    const orderId = orderResult.rows[0].id;

    // Step 2: Insert each item into order_items
    for (let item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.item_id, item.quantity]
      );
    }

    res.status(200).json({ message: 'Order placed successfully!', order_id: orderId });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error!');
  }
});

module.exports = router;