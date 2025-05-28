const express = require('express');
const pool = require("./db");
const userRoutes = require("./routes");

const app = express();
// middleware to parse JSON 
app.use(express.json());

// home page
app.get("/", (req,res) => {
  res.send("Welcome to the User API !");
});

// Mount the routes
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});