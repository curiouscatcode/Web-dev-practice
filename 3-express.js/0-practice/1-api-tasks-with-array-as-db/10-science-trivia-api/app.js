// 5️⃣ Science Trivia API
//    - Store science-related trivia questions.  
//    - `/trivia` → Returns a random question.  
//    - `/trivia?difficulty=hard` → Returns a hard trivia question.  
// boiler plate code
const { error } = require('console');
const express = require('express');
const app = express();
const port = 4000;
const path = require('path');
// importing static files
app.use(express.static(path.join(__dirname, 'public')));
// middleware
app.use(express.json());
//data
const triviaData = [
  {
    difficulty: "easy",
    question: "What is the chemical symbol for water?",
    answer: "H2O"
  },
  {
    difficulty: "easy",
    question: "How many planets are in the Solar System?",
    answer: "8"
  },
  {
    difficulty: "medium",
    question: "What gas do plants absorb from the atmosphere during photosynthesis?",
    answer: "Carbon dioxide"
  },
  {
    difficulty: "medium",
    question: "Who developed the theory of general relativity?",
    answer: "Albert Einstein"
  },
  {
    difficulty: "hard",
    question: "What is the heaviest naturally occurring element found on Earth?",
    answer: "Uranium"
  },
  {
    difficulty: "hard",
    question: "What is the second law of thermodynamics?",
    answer: "Entropy of an isolated system always increases over time"
  }
];

// home page
app.get('/', (req,res) => {
  res.status(200).sendFile(__dirname, 'public', 'index.html');
});

// get 
app.get('/trivia', (req,res) => {
  // query parameter
  const { difficulty, question, answer } = req.query;
  // result global variable
  let result = triviaData;
  // if conditions
  if(difficulty){
    // filtering
    result = triviaData.filter((f) => f.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if(question){
    result = triviaData.filter((q) => q.question.toLowerCase() === question.toLowerCase());
  }
  if(answer){
    result = triviaData.filter((a) => a.answer.toLowerCase() === answer.toLowerCase());
  }
  // if conditions
  if(result.length){
    const randomTrivia = result[Math.floor(Math.random() * result.length)];
    res.status(200).json(randomTrivia);
  } else{
    res.status(404).json({
      error: 'Data not found'
    });
  }
});

// post
app.post('/trivia', (req,res) => {
  const { difficulty, question, answer } = req.body;
   if(!difficulty || !question || !answer){
    return  res.status(400).json({
      error: 'Please provide difficulty, question and answer.'
    });
  }
  triviaData.push({ difficulty, question, answer });
  res.status(200).send(`
      <strong>Trivia Successfully pushed!</strong>
    `);
});

app.patch('/trivia/:question', (req,res) => {
  // search
  const trivia = triviaData.find((q) => d.question.toLowerCase() === req.params.question.toLowerCase());
  if(trivia){
    if(req.body.question){
      trivia.question = req.body.question;
    }
    if(req.body.answer){
      trivia.answer = req.body.answer;
    }
    // respond
    res.status(200).json({
      message: 'Trivia updated successfully', 
      trivia
    });
  } else{
    // else case
    res.status(400).json({
      error: 'Not found.'
    });
  }
});

// put
app.put('/trivia/:difficulty', (req,res) => {
  // 1. search
  const trivia = triviaData.find((d) => d.difficulty.toLowerCase() === req.params.difficulty.toLowerCase());
  // 2. edge case 
  if(!req.body.question || !req.body.answer){
    return  res.status(400).send('Please provide both question and answer');
  }
  if(trivia){
    // 3. update
    trivia.question = req.body.question;
    trivia.answer = req.body.answer;
    // 4. response
    res.status(200).json({
      message: "Successfully changed the trivia data!", 
      trivia
    });
  } else{
    // 5. error case 
    res.status(400).json({
      error: "Not found."
    });
  }
});

// delete request
// 1. define the route
app.delete('/trivia/:answer', (req,res) => {
  // 2. find the index of the data array
  const index = triviaData.findIndex((f) => f.answer.toLowerCase() === req.params.answer.toLowerCase());
  if (index !== -1){    // index not equal to -1 because -1 is also truthy value hence it will try to delete the non existing value
    // 3. Remove from Array
    triviaData.splice(index, 1);
    res.status(200).json({
      // 4. respond
      message: "Data successfully deleted!"
    });
  } else{
      // 5. ERROR response
    res.status(400).json({
      error: "Data not found"
    });
  }
});

// start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});