// 2️⃣ Fun Facts API
//    - Store facts about different topics (space, animals, history, etc.).  
//    - `/fact` → Returns a random fact.  
//    - `/fact?category=space` → Returns a space-related fact.  
// boiler plate code
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// static files
app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(express.json());
//data
const factsData = [
  { category: "space", fact: "One day on Venus is longer than a year on Venus." },
  { category: "space", fact: "Neutron stars are so dense that a sugar-cube-sized amount of material would weigh a billion tons on Earth." },
  { category: "animals", fact: "Octopuses have three hearts and blue blood." },
  { category: "animals", fact: "A group of flamingos is called a 'flamboyance'." },
  { category: "history", fact: "Napoleon was once attacked by a horde of bunnies." },
  { category: "history", fact: "The Eiffel Tower can grow taller in the summer due to heat expansion." },
  { category: "technology", fact: "The first computer mouse was made of wood." },
  { category: "technology", fact: "NASA's internet speed is 91 gigabits per second." }
];

// home page
app.get('/', (req,res) => {
  res.status(200).sendFile(path.join(__dirname,'public','index.html'));
});

app.get('/fact', (req,res) => {
  // query parameter
  const { category, fact } = req.query;
  // result global variable
  let result = factsData;
  // if conditions
  if (category){
    // filtering out case insensitive 
    result = factsData.filter((f) => f.category.toLowerCase() === category.toLowerCase());
  }
  if(fact) {
    result = factsData.filter((m) => m.fact.toLowerCase() === fact.toLowerCase());
  }
  // if condition
  if(result.length > 0){
    const randomFact = factsData[Math.floor(Math.random() * result.length)];
    res.status(200).json(randomFact);
  } else{
    res.status(404).send('No data found. ');
  }
});

// post request
app.post('/fact', (req,res) => {
  //params
  const { category, fact } = req.body;
  // if condition if incorrect post
  if(!category || !fact){
    res.status(400).json({
      error: 'Please provide both category and fact.'
    })
  }
  // actual posting
  factsData.push({ category, fact });
  res.status(200).send(`
    <strong>Your post has been successful</strong>  
  `)
})
// start server
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});