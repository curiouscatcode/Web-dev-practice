// 1️⃣ Basic API: Joke Generator
// - Create an Express API that serves random jokes.
// - Use an array of jokes and return one at random when a user requests `/joke`.  
// - Add a `/jokes` endpoint that returns all jokes.  

// Concepts Practiced:
// ✅ Creating an Express server  
// ✅ Handling routes  
// ✅ Sending JSON responses  

// 📌 *Extra Challenge:* Add a query parameter like `/joke?category=programming`.  

const express = require('express');
const app = express();
const port = 5000;

const jokes = [
  {text: "Why do programmers prefer dark mode? Because light attracts bugs!", category: "programming" },
  {text: "How do you comfort a JavaScript bug? You console it.", category: "programming"},
  {text: "Why don't programmers like nature? It has too many bugs.", category: "programming"},
  {text: "Why don't skeletons fight each other? They don't have the guts.", category: "general"},
  {text: "Why couldn't the bicycle stand up by itself? Because it was two-tired.", category: "general"},
  {text: "Parallel lines have so much in common.It's a shame they'll never meet.", category: "general"}
];


app.get('/', (req,res) => {
  res.send('Hello');
});

app.get('/jokes', (req,res) => {
  const category = req.query.category;
  // If a category is provided, filter jokes by category (case-insensitive); otherwise, return all jokes.
  let filteredJokes;
  if(category){
    jokes.filter((joke) => joke.category.toLowerCase() === category.toLowerCase());
  } else{
    filteredJokes = jokes;
  }
  if(filteredJokes.length > 0){
    const randomJoke = filteredJokes[Math.floor(Math.random() * filteredJokes.length)];
    console.log('Working');
    res.status(200).send(randomJoke.text);
  } else {
    res.status(404).send("Joke not found. Type a category in query");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});