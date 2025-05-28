const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');
const checkAdmin = require('../middleware/checkAdmin');

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    // 1. req.body 
    const { name, email, password, is_admin } = req.body;
    // 2. edge case01
    if(!name || !email || !password){
      return res.status(400).json({
        error: 'All thses fields required: name, email, password and is_admin is optional !'
      });
    }
    // 3. edge case 02: check if user already exists or not 
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
      "INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, is_admin]
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
  try {
    // 1. req.body
    const { name, email, password } = req.body;
    // 2. edge case 01 
    if(!name || !email || !password){
      return res.status(400).json({
        error: 'All 3 fields required !'
      });
    }
    // 3. edge case 03: check if user Exists 
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
   
    // 6. If password does not match, throw error 
    if(!isMatch){
      return res.status(400).json({
        error: 'Invalid credentials !'
      });
    }

    // 7. Create Token 
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '7d'});

    // 8. response 
    res.status(200).json({
      message: 'LogIn Successfull !',
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server Error !'
    });
  }  
});

// POST /products (Admin only)
//  — Add a new product (name, price, stock, description)
router.post('/products', requireAuth, checkAdmin, async (req, res) => {
  try {
    // 1. req.body
    const { name, price, stock, description } = req.body;
    // 2. edge case 01
    if(!name || !price || !stock){
      return res.status(400).json({
        error: 'Name, price, stock are must and description is optional !'
      });
    }
    // 3. global variable and insert command 
    const newProduct = await pool.query(
      "INSERT INTO products (name, price, stock, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, price, stock, description]
    );
    
    // 4. response 
    res.status(200).json({
      message: 'New product added successfully !',
      product: newProduct.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /products — List all products
router.get('/products', requireAuth, async (req, res) => {
  try {
    // 1. check if any product exists 
    const product = await pool.query(
      "SELECT * FROM products"
    );
    if(product.rows.length === 0){
      return res.status(400).json({
        error: 'No product exists !'
      });
    }
    // 2. global variable and select command 
    const allProducts = await pool.query(
      "SELECT * FROM products "
    );
    // 3. response 
    res.status(200).json({
      message: 'Here are all products:- ',
      products: allProducts.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /products/:id — Get details of a product
router.get('/products/:id', requireAuth, async (req, res) => {
  try {
    // 1. req.params 
    const  productId  = parseInt(req.params.id);
    if(!productId){
      return res.status(400).json({
        error: 'ProductId is required !'
      });
    }

    // 2. egde case 02: check if product with given id exists or not 
    const productCheck = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );
    if(productCheck.rows.length === 0){
      return res.status(400).json({
        error: `No product with id: ${productId} exists !`
      });
    }

    // 3. global variable and select command 
    const product = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );
    // response 
    res.status(200).json(product.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// PATCH /products/:id (Admin only) — Update product info
router.patch('/products/:id', requireAuth, checkAdmin, async (req, res) => {
  try {
    // 1. req.params 
    const productId = parseInt(req.params.id);
    if(!productId){
      return res.status(400).json({
        error: 'ProductId is required !'
      });
    } 
    // 2. edge case: check if product with given id exists or not 
    const productCheck = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );
    if(productCheck.rows.length === 0){
      return res.status(400).json({
        error: `No product with id: ${productId} exists !`
      });
    }
    
    // 3. req.body
    const { name, price, stock, description } = req.body;
    
    // 4. global variable and update command (use coalesce since it helps to keep non updated part remain same)
    const updatedProduct = await pool.query(
      "UPDATE products SET name = COALESCE($1, name), price = COALESCE($2, price), stock = COALESCE($3, stock), description = COALESCE($4, description) WHERE id = $5 RETURNING *",
      [name, price, stock, description, productId]
    );
    
    // 5. response 
    res.status(200).json({
      message: `Here's the updated details of product with id: ${productId}:- `,
      product: updatedProduct.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// DELETE /products/:id (Admin only) — Delete a product
router.delete('/products/:id', requireAuth, checkAdmin, async (req, res) => {
  try {
    // 1. req.params 
    const productId = parseInt(req.params.id);
    if(!productId){
      return res.status(400).json({
        error: 'ProductId is required !'
      });
    }

    // 2. edge case: check if product with given id exists or not 
    const productCheck = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );
    if(productCheck.rows.length === 0){
      return res.status(400).json({
        error: `No product with id: ${productId} exists !`
      });
    }
        
    // 3. delete command 
    await pool.query(
      "DELETE FROM products WHERE id = $1",
      [productId]
    );

    // 4. response 
    res.status(200).json({
      message: `Product with id: ${productId} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// 🛒 Cart Routes
// POST /cart (protected) — Add item to cart (product_id, quantity)
router.post('/cart', requireAuth, async (req, res) => {
  try {
    // 1. get user_id
    const user_id = req.user.id;
    // 2. req.body
    const { product_id, quantity } = req.body;
    // 3. edge case 01
    if(!product_id || !quantity){
      return res.status(400).json({
        error: 'All fields required !'
      });
    }
    // 4. edge case 02: check if that product exists or not 
    const productCheck = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [product_id]
    );
    if(productCheck.rows.length === 0){
      return res.status(400).json({
        error: `No product with id: ${product_id} exists !`
      });
    }
    // 6.If already there, remove from cart  
    const cartCheck = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if(cartCheck.rows.length > 0){
      // remove from cart 
      await pool.query(
        "DELETE FROM cart WHERE user_id = $1 AND product_id = $2",
        [user_id, product_id]
      );
      res.status(200).json({
        message: `Product with product_id: ${product_id} is removed from cart for user with user_id: ${user_id}`
      });
    } else {
      // 7. global variable and insert command 
      const newCart = await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
        [user_id, product_id, quantity]
      );

      // 8. response 
      res.status(200).json(newCart.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// GET /cart (protected) — Get user's cart items
router.get('/cart', requireAuth, async (req, res) => {

  try {
    // 1. req.user.id
    const user_id = req.user.id;

    // 2. check if anything exists in cart or not 
    const checkCart = await pool.query(
      "SELECT * FROM cart"
    );
    if(checkCart.rows.length === 0){
      return res.status(400).json({
        error: 'No item exists in cart !'
      });
    }  
    // 3. get all items from cart 
    const cartItems = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1",
      [user_id]
    );
    // 4. response 
    res.status(200).json({
      message: 'Here are all items in cart: ',
      allCartItems: cartItems.rows
    }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    })
  }
});

// DELETE /cart/:product_id (protected) — Remove item from cart
router.delete('/cart/:product_id', requireAuth, async (req, res) => {
  try {
    // 1. req.params 
    const product_id = req.params.product_id;
    if(!product_id){
      return res.status(400).json({
        error: 'Please provide product_id'
      });
    }
    // 2. req.user
    const user_id = req.user.id;

    // 3. check if product with given product_id exists in cart table
    const cartCheck = await pool.query(
      "SELECT * FROM cart WHERE product_id = $1 AND user_id = $2",
      [product_id, user_id]
    )
    if(cartCheck.rows.length === 0){
      return res.status(400).json({
        error: `No product in cart with product_id = ${product_id} !`
      });
    }

    // 4. delete command 
    await pool.query(
      "DELETE FROM cart WHERE product_id = $1 AND user_id = $2",
      [product_id, user_id]
    );

    // 5. response 
    res.status(200).json({
      message: `Product with product_id: ${product_id} for user_id: ${user_id} removed from cart !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

// POST /order (protected) — Place order for current cart items
router.post('/order', requireAuth, async (req, res) => {
  try {
    // req.user
    const user_id = req.user.id;
    
    // req.body
    const { total_price } = req.body;
    if(!total_price){
      return res.status(400).json({
        error: 'Please provide total_price !'
      });
    }

    // global variable and insert command 
    const newOrder = await pool.query(
      "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *",
      [user_id, total_price]
    );

    // response 
    res.status(200).json({
      message: 'Your new order placed successfully !',
      newOrder: newOrder.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server Error !'
    });
  } 
});

// GET /orders (protected) — Get all user orders
router.get('/orders', requireAuth, async (req, res) => {
  try {
    // req.user 
    const user_id = req.user.id;
    // check if order with user_id exists or not 
    const checkOrder = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [user_id]
    );
    if(checkOrder.rows.length === 0){
      return res.status(400).json({
        error: `No order from user_id: ${user_id} !`
      });
    }

    // global variable and select command query
    const allOrders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [user_id]
    );

    // response 
    res.status(200).json({
      message: `Here are all orders with user_id: ${user_id}:- `,
      allOrders: allOrders.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server Error !'
    });
  }  
});

// GET /orders/:id (protected) — Get specific order details
router.get('/orders/:id', requireAuth, async (req, res) => {
  try {
    // 1. req.params 
    const order_id = req.params.id;
    if(!order_id){
      return res.status(400).json({
        error: 'Please provide order_id you want to find !'
      });
    }

    // 2. get user_id 
    const user_id = req.user.id;

    // 3. check if order with given order_id exists or not
    const checkOrder = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [order_id, user_id]
    );
    if(checkOrder.rows.length === 0){
      return res.status(400).json({
        error: `Order with order_id: ${order_id} does not exists !`
      });
    }

    // 3. global variable and select command 
    const order = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [order_id, user_id]
    );

    // 4. response 
    res.status(200).json(order.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error !'
    });
  }  
});

module.exports = router;