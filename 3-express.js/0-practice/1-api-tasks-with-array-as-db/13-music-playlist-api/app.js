// 4️⃣ Music Playlist API 
//   - Store songs with `title`, `artist`, and `genre`.  
//   - `GET /songs` → Returns all songs.  
//   - `GET /songs?artist=Arijit` → Returns songs by a specific artist.  
//   - `POST /songs` → Adds a new song.  
//   - `DELETE /songs/:id` → Deletes a song.
const express = require('express');
const app = express();
const port = 4000;

// middleware
app.use(express.json());

// data
const songsData = [
  { id: 1, title: "Tum Hi Ho", artist: "Arijit Singh", genre: "Romantic" },
  { id: 2, title: "Shape of You", artist: "Ed Sheeran", genre: "Pop" },
  { id: 3, title: "Believer", artist: "Imagine Dragons", genre: "Rock" },
  { id: 4, title: "Kesariya", artist: "Arijit Singh", genre: "Romantic" },
  { id: 5, title: "Blinding Lights", artist: "The Weeknd", genre: "Pop" },
  { id: 6, title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "Rock" },
  { id: 7, title: "Jai Ho", artist: "A. R. Rahman", genre: "Bollywood" },
  { id: 8, title: "Perfect", artist: "Ed Sheeran", genre: "Pop" },
  { id: 9, title: "Tera Ban Jaunga", artist: "Akhil Sachdeva", genre: "Romantic" },
  { id: 10, title: "Thunder", artist: "Imagine Dragons", genre: "Rock" }
];

// home page
app.get('/', (req,res) => {
  res.status(200).send('Hello, Welcome to home page');
  // res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// get
app.get('/songs', (req,res) => {
  // query parameter
  const { id, title, artist, genre } = req.query;
  // result global varibale
  let result = songsData;
  // if conditions 1
  if(id){
    const songID = Number(id);
    // filtering out, case insensitive 
    result = songsData.filter((i) => i.id === songID);
  } 
  if(title){
    result = songsData.filter((t) => t.title.toLowerCase() === title.toLowerCase());
  }
  if(artist){
    result = songsData.filter((a) => a.artist.toLowerCase() === artist.toLowerCase());
  }
  if(genre){
    result = songsData.filter((g) => g.genre.toLowerCase() === genre.toLowerCase());
  }

  // if condition
  if(result.length > 0){
    // random
    const randomSong = result[Math.floor(Math.random() * result.length)];
    res.status(200).json(randomSong);
  } else{
    res.status(400).json({
      error: 'No data found.'
    });
  }
});

// post
app.post('/songs', (req,res) => {
  // query params
  const { id, title, artist, genre } = req.body;
  // edge case
  if(!id || !title || !artist || !genre){
    return res.status(400).send('Please provide all the required things: id, title, artist, genre.');
  }
  // before pushing check if id exists 
   if (songsData.some(song => song.id === id)){
    res.status(400).send('A song with this ID already exist.');
  }
  // push
  songsData.push({ id, title, artist, genre });
  // response
  res.status(200).send(`
      <strong>Song successfully pushed !</strong>
    `)
});

// put
app.put('/songs/:id', (req,res) => {
  // 1.search using .find
  const songID = Number(req.params.id);
  const songs = songsData.find((song) => song.id === songID);
  // 2. edge cases
  if(!req.body.title || !req.body.artist || !req.body.genre){
    return res.status(400).json({
      error: 'Please provide all the things!'
    });
  }
  // 3. if conditions (truthy)
  if(songs){
    // update
    songs.title = req.body.title;
    songs.artist = req.body.artist;
    songs.genre = req.body.genre;
    // response
    res.status(200).json({
      message: 'Successfully updated!', 
      songs 
    });
  } else {
    // error response
    res.status(400).json({
      error: 'No such data to update!'
    });
  }
});

// delete
// 1. define the route
app.delete('/songs/:id', (req, res) => {
  // 2. Find the index of to be deleted data
  const songID = Number(req.params.id);
  const index = songsData.findIndex((song) => song.id === songID);
  // 3. if index !== -1
  if(index !== -1){
    // 4. remove the data using splice 
    songsData.splice(index, 1);
    // 5. response
    res.status(200).json({
      message: 'Data successfully deleted!'
    });
  } else{
    res.status(404).json({
      error: 'No such data found to be deleted !'
    });
  }
});

// server starts
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});