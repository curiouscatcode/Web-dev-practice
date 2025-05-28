const express = require('express');
const pool = require("./db");

const router = express.Router();

// 1. Create a new user (CREATE)
router.post("/users", async (req,res) => {
  try {
    const { name, email, age } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *",
      [name, email, age]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 2. Get all users (READ)
router.get("/users", async (req,res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 3. Get a user by ID (read params)
router.get("/users/:id", async (req,res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (user.rows.length === 0){
      return res.status(404).send("User not found");
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }  
});

// 4. update a user (UPDATE)
router.put("/users/:id", async (req,res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;
    const updatedUser = await pool.query(
      "UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *",
      [name, email, age, id]
    );
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 5. Delete a user (DELETE)
router.delete("/users/:id", async (req,res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({
      message: "User deleted successfully !"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;