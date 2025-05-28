// 2️ Book Library API  
//   - Store books with `title`, `author`, and `genre`.  
//   - `GET /books` → Returns all books.  
//   - `GET /books?genre=fiction` → Returns books of a specific genre.  
//   - `POST /books` → Adds a new book.  
//   - `DELETE /books/:id` → Deletes a book. 
// boiler plate code 
const express = require('express');
const app = express();
const port = 4000;
const path = require('path');

// importing static files
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(express.json());

//data
const booksData = [
  { id: 1, title: "1984", author: "George Orwell", genre: "Dystopian" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic" },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-fiction" },
  { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy" }
];

// home page
app.get('/', (req,res) => {
  // res.status(200).send('Hello. Welcome to home page.');
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// get
app.get('/books', (req,res) => {
  // query parameter
  const { id, title, author, genre } = req.query;
  // result global variable
  let result = booksData;
  // if condition 1
  if(id){
    // filtering out , case insensitive
    const bookID = Number(id); // converting id into number from string. 
    result = booksData.filter((i) => i.id === bookID);
  }
  if(title){
    result = booksData.filter((t) => t.title.toLowerCase() === title.toLowerCase());
  }
  if(author){
    result = booksData.filter((a) => a.author.toLowerCase() === author.toLowerCase());
  }
  if(genre){
    result = booksData.filter((g) => g.genre.toLowerCase() === genre.toLowerCase());
  }

  // if condition 2
  if(result.length > 0){
    // random
    const randomBook = result[Math.floor(Math.random() * result.length)];
    // res.status(200).send(randomBook);
    res.status(200).json(randomBook);
  }
});

// post 
app.post('/books', (req, res) => {
  // 1. query params 
  const { id, title, author, genre } = req.body;
  // 2. edge case
  if(!id || !title || !author || !genre){
    res.status(400).send(`Please provide all the required data:id, title, author & genre`);
  } 
  // 3. push (in case of array)
  booksData.push( {id, title, author, genre} );
  // 4. response
  res.status(200).send(`
      <strong>Book pushed successfully !</strong>
    `)
});

// put 
app.put('/books/:id', (req,res) => {
  // 1. search
  const bookID = Number(req.params.id);
  const books = booksData.find((i) => i.id === bookID);
  // 2. edge case
  if(!req.body.title || !req.body.author || !req.body.genre){
    return res.status(400).json({
      error: "Title, author, genre are required."
    });
  }
  // 3. if condition 
  if(books){
    // update
    books.title = req.body.title;
    books.author = req.body.author;
    books.genre = req.body.genre;
    // response in json
    res.status(200).json({
      message: "Successfully put the new book!",
      books
    });
  } else {
    // error response in json
    res.status(400).json({
      error: "Book of given id not found !"
    });
  }
});

// delete 
// 1. define the route
app.delete('/books/:id', (req,res) => {
  // 2. find the index of the required book using id
  const bookID = Number(req.params.id);
  const index = booksData.findIndex((i) => i.id === bookID);
  // 3. if condition when if(index !== -1)
  if (index !== -1){
    // 4. remove the required book using splice()
    booksData.splice(index, 1);
    // 5. response 
    res.status(200).json({
      message: "Book deleted successfully !"
    }); 
  } else{
    // 6. error response
    res.status(404).json({
      error: "Error"
    });
  }
});

// start server
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});