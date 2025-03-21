// 1️⃣ Math Facts API✅ (Similar to Joke API but for math facts)  
//    - Store a list of math facts (e.g., "0 is neither prime nor composite").  
//    - `/mathFact` → Returns a random math fact.  
//    - `/mathFact?category=algebra` → Returns a random algebra fact.  
// boiler plate
const express = require('express');
const app = express();
const port = 5000;
// data 
const factsData = [
  {
    text: "The quadratic formula can solve any quadratic equation of the form ax² + bx + c = 0.",
    category: "Algebra"
  }, 
  {
    text: "A negative multiplied by a negative is always positive.", 
    category: "Algebra"
  }, 
  {
    text: "The sum of all interior angles in a triangle is always 180°.", 
    category: "Geometry"
  },
  {
    text: "A circle has an infinite number of lines of symmetry.", 
    category: "Geometry"
  }, 
  {
    text: "The derivative of a constant is always zero.",
    category: "Calculus"
  }, 
  {
    text: "The area under a curve is found using integration.", 
    category: "Calculus"
  }, 
  {
    text: "Zero is the only number that is neither positive nor negative.", 
    category: "Number Theory"
  }, 
  {
    text: "The number 1 is not a prime number.",
    category: "Number Theory"
  }, 
  {
    text: "The probability of flipping heads in a fair coin toss is 50%.",
    category: "Probability"
  }
];
// home page
app.get('/', (req,res) => {
  res.status(200).send('Home Page');
});
// fact page
app.get('/mathFact', (req,res) => {
  // query parameter 
  const category = req.query.category;
  // global result variable
  let result;
  // if condition , when query is put or not
  if(category){
    // filtering the facts data and storing it in variable result
    result = factsData.filter((f) => f.category.toLowerCase() === category.toLowerCase());
  }else {
    // normal case
    result = factsData;
  }
  // if condition, for result if 
  if(result.length > 0){
    const randomFact = result[Math.floor(Math.random() * result.length)];
    res.status(200).send(randomFact.text);
  } else{
    res.status(404).send('No Data Found');
  }
});

// starting server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});