const express = require('express');
const pool = require('./db');

const router = express.Router();

// 1. Create a new blog (CREATE)
// - **Create a blog post** with `title`, `content`, `author`, and `published_status` (true/false).  
router.post('/blogs', async (req,res) => {
  try {
    // req.body
    const { title, content, author, published_status = false } = req.body || {};
    // edge case 
    if(!title || !content || !author){
      return res.status(400).send('Please provide all the required fields: title, content, author And published_status is false by default !');
    }
    // global variable and insert into command 
    const newBlog = await pool.query("INSERT INTO blogs (title, content, author, published_status) VALUES ($1, $2, $3, $4) RETURNING *", 
      [title, content, author, published_status]
    );
    // response 
    res.status(200).json(newBlog.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('server error !');
  }  
});

// 2. Get all blogs (Read)
// Fetch all blog posts** (with pagination).  
//**Filter blog posts** by `author` or `published_status`. 
router.get('/blogs', async (req,res) => {
  try {
    // extract the query
    const { author, published_status } = req.query;
    // base query 
    let query = "SELECT * FROM blogs";
    let values = [];
    let conditions = [];
    // filtering 
    if(author !== undefined){
      conditions.push(` author ILIKE $${values.length + 1}`);
      values.push(`%${author}%`);
    }
    if(published_status !== undefined){
      conditions.push(` published_status ILIKE $${values.length + 1}`);
      values.push(`%${published_status}%`);
    }
    // where clause and joining
    if(conditions.length > 0){
      query += " WHERE " + conditions.join(" AND ");
    }
    // global variables and select command 
    const allBlogs = await pool.query(query, values);
    // response 
    res.status(200).json(allBlogs.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 3. GET BLOG BY ID (READ)
// **Fetch a single blog post by ID**. 
router.get('/blogs/:id', async (req,res) => {
  try {
    // req.params
    const  id  = parseInt(req.params.id);
    // edge case 
    if(isNaN(id)){
      return res.status(400).send('Id should be a positive integer !');
    }
    // global variable and select command 
    const blogById = await pool.query("SELECT * FROM blogs WHERE id = $1",
      [id]
    );
    // edge case 
    if(blogById.rows.length === 0){
      return res.status(400).send('No blog found !');
    }
    // response 
    res.status(200).json(blogById.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// 4. Update the blog (UPDATE)
// Update a blog post** (anyone can edit for now).  
router.put('/blogs/:id', async (req,res) => {
  try {
    // req.params
    const { id } = req.params;
    // req.body
    const { title, content, author, published_status = false } = req.body;
    // edge case 
    if(!title || !content || !author){
      return res.status(400).send('Please provide all the required fields to be updated: title, content, author and published_status if true !');
    }
    // global variable and update command 
    const updatedBlog = await pool.query("UPDATE blogs SET title = $1, content = $2, author = $3, published_status = $4 WHERE id = $5 RETURNING *", 
      [title, content, author, published_status, id]
    );
    // response 
    res.status(200).json(updatedBlog.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// Delete a blog (DELETE)
// Delete a blog post** (anyone can delete for now).  
router.delete('/blogs/:id', async (req,res) => {
  try {
    // global variable
    const { id } = req.params;
    // edge case
    if(isNaN(id)){
      return res.status(400).send(`Id: ${id} should be a positive number !`);
    }
    if(!id){
      return res.status(400).send('Please provide id of the blog that you want to delete !');
    }
    // delete command 
    await pool.query("DELETE FROM blogs WHERE id = $1", 
      [id]
    );
    // response 
    res.status(200).json({
      message: `Blog with id ${id} deleted successfully !`
    }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// ### **2. Comments & Likes**
// - Users can **add a comment** to a blog post.
router.post('/blogs/:blog_id/comments', async (req,res) => {
  try {
    // req.params
    const blogId  = parseInt(req.params.blog_id);
    // req.body: extract the query
    const { user_name, text } = req.body || {};
    // edge case 
    if(isNaN(blogId)){
      return res.status(400).send('BlogId is not a number. It should be a positive integer !');
    }
    // edge case 
    if(!user_name || !text){
      return res.status(400).send('Commenter should have a user_name and text !');
    }
    // edge case
    if(!blogId){
      return res.status(400).send(`Blog with id: ${blogId} does not exist !`);
    }
    // global variable and insert into command 
    const newComment = await pool.query("INSERT INTO comments (blog_id, user_name, text) VALUES ($1, $2, $3) RETURNING *", 
      [blogId, user_name, text]
    );
    // response 
    res.status(200).json(newComment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// Get all comments 
//Fetch all comments for a blog post.
router.get('/blogs/:blog_id/comments', async (req,res) => {
  try {
    // req.params
    const  blog_id   = parseInt(req.params.blog_id);
    // edge case 
    if(isNaN(blog_id)){
      return res.status(400).send('Please provide blog_id as a number !');
    }
    if(!blog_id){
      return res.status(400).send(`Blog with id: ${blog_id} doesn not exists !`);
    }
    // global variable and select command 
    const comments = await pool.query("SELECT * FROM comments WHERE blog_id = $1", 
      [blog_id]
    );
    // response 
    res.status(200).json(comments.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// Users can **edit or delete** their comments.  
router.put('/blogs/:blog_id/comments/:id', async (req,res) => {
  try {
    // req.params
    const id = parseInt(req.params.id);
    const blog_id = parseInt(req.params.blog_id);
    // req.body
    const { user_name, text } = req.body;
    // edge cases 
    if(isNaN(id)){
      return res.status(400).send('Id should be a positive number !');
    }
    if(isNaN(blog_id)){
      return res.status(400).send('Blog_id should be a positive number !');
    }
    if(!blog_id){
      return res.status(400).send('Please provide blog_id !');
    }
    if(!id){
      return res.status(400).send('id should be there !');
    }
    if(!user_name || !text){
      return res.status(400).send('Please provide both user_name and text that needs to be updated !');
    }
    // global variable and update command 
    const updatedComment = await pool.query("UPDATE comments SET user_name = $1 , text = $2 WHERE id = $3 AND blog_id = $4 RETURNING *",
      [user_name, text, id, blog_id]
    );

    if (updatedComment.rows.length === 0) {
      return res.status(404).send('No comment found for the given blog and comment ID');
    }
    
    // response 
    res.status(200).json(updatedComment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

// delete** their comments
router.delete('/blogs/:blog_id/comments/:id', async (req,res) => {
  try {
    // req.params 
    const  blog_id  = parseInt(req.params.blog_id);
    const id = parseInt(req.params.id);
    // edge case 
    if(isNaN(blog_id)){
      return res.status(400).send('Enter valid blog_id !');
    }
    if(isNaN(id)){
      return res.status(400).send('Enter valid id !');
    }
    if(!blog_id || !id){
      return res.status(400).send('Either blog_id or id doesn\'t exists !');
    }
    // delete command 
    await pool.query("DELETE FROM comments WHERE blog_id = $1 AND id = $2",
      [blog_id, id]
    );
    // response 
    res.status(200).json({
      message: `Comment with id = ${id} in blog_id = ${blog_id} deleted successfully ! `
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error !');
  }  
});

module.exports = router;