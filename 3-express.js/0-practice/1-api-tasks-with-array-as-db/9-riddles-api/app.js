// 4️⃣ Riddles API  
//   - Store riddles and their answers.  
//   - `/riddle` → Returns a random riddle.  
//   - `/riddle?category=logic` → Returns a logic-based riddle.  
// boiler plate code
const express = require('express');
const app = express();
const port = 5000;
const path = require('path');
// importing static files
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(express.json());

// data
const riddlesData = [
  { category: "logic", question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "An echo" },
  { category: "logic", question: "The more you take, the more you leave behind. What am I?", answer: "Footsteps" },
  { category: "math", question: "I am a three-digit number. My tens digit is five more than my ones digit, and my hundreds digit is eight less than my tens digit. What number am I?", answer: "194" },
  { category: "math", question: "I am an odd number. Take away one letter, and I become even. What am I?", answer: "Seven" },
  { category: "wordplay", question: "What has to be broken before you can use it?", answer: "An egg" },
  { category: "wordplay", question: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "The letter M" },
  { category: "fun", question: "What has a face and two hands but no arms or legs?", answer: "A clock" },
  { category: "fun", question: "The more you remove from me, the bigger I get. What am I?", answer: "A hole" }
];

// home page
app.get('/', (req,res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/riddle', (req,res) => {
  // query parameter
  const { category, question, answer } = req.query;
  // global variable result
  let result = riddlesData;
  // if conditions
  if(category){
    // filter out case insensitive
    result = riddlesData.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  }
  if(question){
    result = riddlesData.filter((q) => q.question.toLowerCase() === question.toLowerCase());
  }
  if(answer){
    result = riddlesData.filter((a) => a.answer.toLowerCase() === answer.toLowerCase());
  }
  // if condition
  if(result.length > 0){
    const randomRiddle = riddlesData[Math.floor(Math.random() * result.length)];
    res.status(200).json(randomRiddle);
  } else{
    res.status(404).json({
      error: 'No data found.'
    });
  }
});

// posting a riddle 
app.post('/riddle', (req,res) => {
  const { category, question, answer } = req.body;
  if(!category || !question || !answer){
    return res.status(404).json({
      error: 'Please provide category, question & answer.'
    });
  }
  riddlesData.push({ category, question, answer });
  res.status(200).send(`
    <strong>Riddle was added successfully!</strong>  
  `);
});

// patch
app.patch('/riddle/:answer', (req,res) => {
  const riddle = riddlesData.find((r) => r.answer.toLowerCase() === req.params.answer.toLowerCase());
  if(riddle){
    riddle.answer = req.body.answer; //update the answer
    return res.status(200).json({
      message: "Riddle updated successfully!", riddle
    });
  } else{
    return res.status(404).json({
      error: "Riddle not found!"
    });
  }
});

// put
app.put('/riddle/:category', (req,res) => {
  const riddle = riddlesData.find((q) => q.category.toLowerCase() === req.params.category.toLowerCase());
  
  if (!req.body.question || !req.body.answer) {
    return res.status(400).json({ error: "Question and answer are required." });
  }

  if(riddle){
    // update 
    riddle.question = req.body.question;
    riddle.answer = req.body.answer;
    return res.status(200).json({
      message: 'Successfully changed the riddle', riddle 
    });
  } else {
    res.status(404).json({
      error: 'Error.'
    });
  }
});

// start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});