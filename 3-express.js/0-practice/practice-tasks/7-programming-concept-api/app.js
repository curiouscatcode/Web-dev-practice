// 🔟 Programming Concepts API  
//   - Store explanations of programming concepts.  
//   - `/concept` → Returns a random concept.  
//   - `/concept?topic=recursion` → Returns an explanation of recursion.
// boiler plate code   
const { error } = require('console');
const exp = require('constants');
const express = require('express');
const app = express();
const port = 5000;
const path = require('path');

// importing static files 
app.use(express.static(path.join(__dirname, 'public')));
// middleware for json
app.use(express.json());

// data
const conceptData = [
  { topic: "Recursion", explanation: "Recursion is a technique where a function calls itself to solve a problem. It usually has a base case to prevent infinite loops." },
  { topic: "Closure", explanation: "A closure is a function that remembers the variables from its outer scope even after the outer function has finished executing." },
  { topic: "Asynchronous Programming", explanation: "Asynchronous programming allows code to run without blocking the execution of other operations, often using callbacks, promises, or async/await." },
  { topic: "Polymorphism", explanation: "Polymorphism is the ability of different objects to respond to the same function or method call in a way specific to their type." },
  { topic: "Encapsulation", explanation: "Encapsulation is the practice of bundling data and methods that operate on that data into a single unit, restricting direct access to some of the object's components." },
  { topic: "Abstraction", explanation: "Abstraction is the concept of hiding implementation details and exposing only essential features of an object or function." },
  { topic: "Inheritance", explanation: "Inheritance allows a class to acquire properties and behaviors from another class, promoting code reusability and hierarchy." },
  { topic: "Big O Notation", explanation: "Big O notation describes the efficiency of an algorithm in terms of time or space complexity as input size grows." },
  { topic: "Functional Programming", explanation: "Functional programming is a paradigm that treats computation as the evaluation of mathematical functions and avoids changing state or mutable data." },
  { topic: "Memoization", explanation: "Memoization is an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again." }
];

// home page
app.get('/', (req,res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/concept', (req,res) => {
  // query parameter
  const { topic, explanation } = req.query;
  // global variable result
  let result = conceptData;
  // if condition
  if(explanation){
    // filtering out
    result = conceptData.filter((f) => f.explanation.toLowerCase() === explanation.toLowerCase());
  }
  if(topic){
    result = conceptData.filter((t) => t.topic.toLowerCase() === topic.toLowerCase());
  }
  // if conditon
  if(result.length > 0){
    const randomConcept = result[Math.floor(Math.random() * result.length)];
    res.status(200).json(randomConcept);
  } else{
    res.status(404).send('Data not found');
  }
});

// post request
app.post('/concept', (req, res) => {
  // params
  const { topic, explanation } = req.body;
  // if both are not input
  if(!topic || !explanation){
    return res.status(400).json({
      error: 'Please provide both topic and explanation'
    });
  }

  // actually posting
  conceptData.push({ topic, explanation });
  res.status(200).send(`
      <strong>Concept was added successfully!</strong>
    `)
})

// start server
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});