// 7️⃣ Notes API 
//  Design an API to manage user notes with these routes:  
//    - `POST /notes` → Add a new note `{ title, content }`  ✅
//    - `GET /notes` → Retrieve all notes  ✅
//    - `GET /notes/:id` → Get a single note  ✅
//    Extra (self): Put ✅
//    - `DELETE /notes/:id` → Delete a note ✅
const express = require('express');
const app = express();
const port = 4000;

// middleware to parse json
app.use(express.json());

// data
const notesData = [
  {
    id: 1,
    title: "Learn Express.js",
    content: "Understand routing, middleware, and error handling in Express.",
  },
  {
    id: 2,
    title: "Database Basics",
    content: "Learn about relational databases, SQL queries, and schemas.",
  },
  {
    id: 3,
    title: "JWT Authentication",
    content: "Implement user authentication using JSON Web Tokens.",
  },
];

// home page
app.get('/', (req,res) => {
  res.status(200).send('Hello. Welcome to home page.');
});

// POST (CREATE)
app.post('/notes', (req,res) => {
  // parameter
  const { id, title, content } = req.body;
  // edge case : if anyone of them is not here
  if(!id || !title || !content){
    return res.status(400).json({
      error: 'Please provide all the required details: id, title, content'
    });
  }

  // edge case: id already exists (some method)
  const notesID = Number(id);
  if(notesData.some((f) => f.id === notesID)){
    return res.status(400).json({
      error: 'Note with this id already exists !'
    });
  }

  // post using '.push()' method
  notesData.push({ id, title, content });
  // response
  res.status(200).json({
    message: 'Note successfully posted !'
  }) 
});

// GET (READ)
app.get('/notes', (req,res) => {
  res.status(200).send(notesData);
});

// GET (READ): QUERY PARAMETER
app.get('/notes/:id', (req,res) => {
  // query parameter
  const id = req.body;
  // result global variable
  let result = notesData;
  // if condition 
  if(id){
    const notesID = Number(req.params.id);
    // filtering out and storing in result variable
    result = notesData.filter((f) => f.id === notesID);
  }

  // edge case
  if(result.length === 0){
    return res.status(404).json({
      error: 'No data found'
    });
  }
  // response
  res.status(200).send(result);
});

// PUT (UPDATE)
app.put('/notes/:id', (req,res) => {
  const id = req.params.id;
  // find the data that needs to be update using find
  const notesID = Number(id);
  const note = notesData.find((f) => f.id === notesID);

  // edge case where user doesn't inputs all the changes that needs to be changed
  if(!req.body.id || !req.body.title || !req.body.content){
    return res.status(400).json({
      error: 'Please provide all the required data: id, title, content.'
    });
  }

  // if condition
  if(note){
    // update
    note.id = req.body.id;
    note.title = req.body.title;
    note.content = req.body.content;

    // respond
    res.status(200).json({
      message: 'Required note changed successfully !',
      note
    });
  } else{
    res.status(404).json({
      error: 'No such data found !'
    });
  }
});

// DELETE (delete)
// 1. define the route
app.delete('/notes/:id', (req,res) => {
  // 2.. find the index of data that needs to be changed using 'findIndex' method
  const notesID = Number(req.params.id);
  const index = notesData.findIndex((f) => f.id === notesID);
  // 3. if condition if(index !== -1)
  if(index !== -1){
    // 4. deleted the selected data using splice method
    notesData.splice(index, 1);

    // 5. respond
    res.status(200).json({
      message: 'Data deleted successfully !',
      notesData
    });
  }
});

// server starts
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});