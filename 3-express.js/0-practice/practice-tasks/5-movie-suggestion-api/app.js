// 8️⃣ Movie Suggestions API  
//   - Store a list of movies by genre.  
//   - `/movie` → Returns a random movie.  
//   - `/movie?genre=action` → Returns a random action movie. 
// Boiler plate 
const express = require('express');
const app = express();
const port = 5000;
const path = require('path');

// importing static file
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // Middleware to parse JSON

// data
const movieData = [
  { title: "Inception", genre: "thriller" },
  { title: "The Dark Knight", genre: "action" },
  { title: "Interstellar", genre: "sci-fi" },
  { title: "The Matrix", genre: "sci-fi" },
  { title: "Gladiator", genre: "action" },
  { title: "Parasite", genre: "thriller" },
  { title: "The Shawshank Redemption", genre: "drama" },
  { title: "Forrest Gump", genre: "drama" },
  { title: "The Godfather", genre: "crime" },
  { title: "Joker", genre: "crime" }
];

// Home page
app.get('/', (req,res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
  console.log('Working');
});

app.get('/movie', (req,res) => {
  // query parameter
  const { title, genre } = req.query;
  // global varibale of result
  let result = movieData;
  // if condition
  if(genre){
    // filter out
    result = movieData.filter((f) => f.genre.toLowerCase() === genre.toLowerCase());
  } 
  if (title){
    result = movieData.filter((m) => m.title.toLowerCase() === title.toLowerCase());
  }
  // if condition
  if (result.length > 0){
    // finding random movie
    const randomMovie = result[Math.floor(Math.random() * result.length)];
    res.status(200).json(randomMovie);
  } else{
    res.status(404).send('Movie not found');
  }
});

// allow posting a movie to a user 
app.post('/movie', (req,res) => {
  const { title, genre } = req.body;
  // case when user doesn't input either title or genre
  if(!title || !genre){
    res.status(404).json({
      error: 'Title and genre are required'
    });
  }
  // case where user inputs both correctly
  movieData.push({ title, genre });
  // response
  res.status(200).send(`
      <strong>Movie was added successfully</strong>
    `);
});

// Server start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});