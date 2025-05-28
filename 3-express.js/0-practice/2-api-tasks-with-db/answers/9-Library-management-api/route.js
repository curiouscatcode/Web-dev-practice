const express = require('express');
const pool = require('./db');

const router = express.Router();

// 1. Create a book: POST /books` → Add a new book (title, author, genre, published_year). 
// a. define the route 
router.post('/books', async (req,res) => {
  try {
    console.log(req.body);
   // a. req.body
   const { title, author, genre, published_year } = req.body || {};
   // b. edge case (in body)
   if(!title || !author || !genre || !published_year){
      return res.status(404).send('Please provide all the required fields: title, author, genre, published_year');
   };

   // c. global variable and insert command 
   const newBook = await pool.query("INSERT INTO books (title, author, genre, published_year) VALUES ($1, $2, $3, $4) RETURNING *", 
    [title, author, genre, published_year]
   );
   // d. response 
   res.status(201).json(newBook.rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 2. `GET /books` → Get all books (with optional filtering by author, genre, year).  
// a. define the route
router.get('/books', async (req, res) => {
  try {
    // Extract query parameters
    const { author, genre, published_year } = req.query;

    // Base query
    let query = "SELECT * FROM books";
    let conditions = [];
    let values = [];

    // Add filtering conditions dynamically
    if (author) {
      values.push(author);      
      // values.length → Dynamically Assigns Parameter Indexes
      conditions.push(`author = $${values.length}`);
    }
    if (genre) {
      values.push(genre);
      conditions.push(`genre = $${values.length}`);
    }
    if (published_year) {
      values.push(published_year);
      conditions.push(`published_year = $${values.length}`);
    }

    // Append WHERE clause if filters exist
    // conditions.length → Checks if Filters Exist
    // If conditions.length === 0, we don’t add WHERE, ensuring all books are fetched
    if (conditions.length > 0) {
      // Joins all conditions with AND to form a valid SQL query.
      query += " WHERE " + conditions.join(" AND ");
    }

    // Execute query with values
    const allBooks = await pool.query(query, values);

    res.status(200).json(allBooks.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error!");
  }
});

// 3. `GET /books/:id` → Get a specific book by ID.
router.get('/books/:id', async (req,res) => {
  try {
    // req.params 
    const { id }  = req.params;
    // global variable and select command 
    const book = await pool.query("SELECT * FROM books WHERE book_id = $1", 
      [id]
    );
    // edge case 
    if(book.rows.length === 0){
      return res.status(400).send("User not found !");
    }
    // response 
    res.status(200).json(book.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 4. `PUT /books/:id` → Update book details. 
router.put('/books/:id', async (req,res) => {
  try {
    // req params 
    const  { id }  = req.params;
    // req.body
    const {title, author, genre, published_year } = req.body || {};
    // global variable and update command 
    const updatedBook = await pool.query('UPDATE books SET title = $1, author = $2, genre = $3, published_year = $4 WHERE book_id = $5 RETURNING *', 
      [title, author, genre, published_year, id]
    );
    // edge case 
    if(!title || !author || !genre || !published_year){
      return res.status(400).send('Please provide all the required fields: title, author, genre, published_year');
    }
    // EDGE CASE -2 
    if(updatedBook.rows.length === 0){
      return res.status(400).send(`Book with id: ${id} doesn't exists !`);
    }
    // response 
    res.status(200).json(updatedBook.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }  
});

//  - `DELETE /books/:id` → Remove a book. 
router.delete('/books/:id', async (req,res) => {
  try {
    // req.params 
    const { id } = req.params;
    // delete command
    await pool.query('DELETE FROM books WHERE book_id = $1', [id]);
    // response 
    res.status(200).json({
      message: `Book entry with id: ${id} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// B. USERAPI
// 1. POST /users` → Register a new user (name, email, membership type). 
router.post('/users', async (req,res) => {
  try {
    console.log(req.body);
    // req.body
    const { name, email, membership_type } = req.body || {};
    // edge case 
    if(!name || !email || !membership_type){
      return res.status(400).send('Please provide all the required fields: name, email, membership_type');
    }
    // global variable and insert into command\
    const newUser = await pool.query("INSERT INTO users (name, email, membership_type) VALUES ($1, $2, $3) RETURNING *",
      [name, email, membership_type]
    );
    // response 
    res.status(201).json(newUser.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// `GET /users` → Get all users. 
router.get('/users', async (req,res) => {
  try {
    // global variable and select command
    const allUsers = await pool.query("SELECT * FROM users");
    // edge case 
    if(allUsers.rows.length === 0){
      return res.status(400).send('No user found !');
    }
    // response 
    res.status(200).json(allUsers.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// - `GET /users/:id` → Get a specific user.  
router.get('/users/:id', async (req,res) => {
  try {
    // req.params 
    // usually psql converts string into int but sometimes it may not. So, it's better to use parseInt(req.params.id, 10). This 10 is telling what type of numberic value are we using
    const  id  = parseInt(req.params.id, 10);
    console.log(req.params);
    // console log to this type 
    console.log("Raw ID:", req.params.id, "Type:", typeof req.params.id);

    // edge case 
    if(isNaN(id)){
      return res.status(400).send('Please enter a positive intege !');
    }
    // global variable and select command 
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    // response 
    res.status(200).json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// - `PUT /users/:id` → Update user details.  
router.put('/users/:id', async (req,res) => {
  try {
    // req.params 
    const  id   = parseInt(req.params.id, 10);
    console.log(typeof req.params.id, id);
    // req.body
    const { name, email, membership_type } = req.body;
    // edge case 
    if(isNaN(id)){
      return res.status(400).send('Id should be a integer !');
    }
    // edge case -2
    if(!name || !email || !membership_type){
      return res.status(400).send('Please provide all the required fields: name, email, membership_type');
    }
    // global varibale and update command 
    const updatedUser = await pool.query("UPDATE users SET name = $1, email = $2, membership_type = $3 WHERE user_id = $4 RETURNING *", 
      [name, email, membership_type, id]
    );
    console.log(updatedUser.rows[0]);
    // response 
    res.status(200).json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// DELETE:-  - `DELETE /users/:id` → Remove a user. 
router.delete('/users/:id', async (req,res) => {
  try {
    // req.params 
    const id = parseInt(req.params.id, 10);
    // edge case 
    if(isNaN(id)){
      return res.status(400).send('Please provide id as int');
    }
    // delete command 
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    // response 
    res.status(200).json({
      message: `User with id: ${id} deleted successfully !`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }
});

// 3. **Borrowing API**  
//   - `POST /borrow` → User borrows a book (user_id, book_id, borrow_date, return_date). 
router.post('/borrow', async (req,res) => {
  try {
    // req.body
    const { user_id, book_id, borrow_date, return_date } = req.body || {};

    // edge case: check whether user and book with given id exists or not 
    const userCheck = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
    if(userCheck.rows.length === 0){
      return res.status(400).send('User with this id does not exists !');
    }
    const bookCheck = await pool.query("SELECT * FROM books WHERE book_id = $1", [book_id]);
    if(bookCheck.rows.length === 0){
      return res.status(400).send('Book with this id does not exists !');
    }

    // edge case input  
    if(!user_id || !book_id || !borrow_date || !return_date){
      return res.status(400).send('Please provide all the required fields: user_id, book_id, borrow_date, return_date');
    }

    // global variable and insert into command 
    const newBorrow = await pool.query("INSERT INTO borrows (user_id, book_id, borrow_date, return_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, book_id, borrow_date, return_date]
    );
    // response 
    res.status(200).json(newBorrow.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

//  - `GET /borrow` → Get all borrowed books.  
router.get('/borrow', async (req,res) => {
  try {
    // global variable and select command 
    const allBorrow = await pool.query("SELECT * FROM borrows");
    // edge case 
    if(allBorrow.rows.length === 0){
      return res.status(400).send('No data in borrows table !');
    }
    // response 
    res.status(200).json(allBorrow.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// - `GET /borrow/:id` → Get a specific borrowed record.  
router.get('/borrow/:id', async (req,res) => {
  try {
    // req.params
    const  id  = parseInt(req.params.id, 10);
    // edge case 
    if(isNaN(id)){
      return res.status(400).send('Please provide id as int !');
    }
    // global variable and select command 
    const borrow = await pool.query("SELECT * FROM borrows WHERE borrow_id = $1", [id]);
    // edge case - 2
    if(borrow.rows.length === 0){
      return res.status(400).send(`Data with id: ${id} doesn't exists !`);
    }
    // RESPONSE 
    res.status(200).json(borrow.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
})

module.exports = router;