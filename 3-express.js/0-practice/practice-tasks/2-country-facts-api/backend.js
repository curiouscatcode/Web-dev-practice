// 9️⃣ Country Facts API
//   - Store facts about different countries.  
//   - `/country` → Returns a random country fact.  
//   - `/country?name=India` → Returns a fact about India.  
// Boiler plate
const express = require('express');
const app = express();
const port = 3000;
// data
const factsData = [
  {
    text: " Vending machines in Japan sell everything from hot ramen to fresh eggs, and there is about one vending machine for every 23 people!", 
    country: 'Japan'
  }, 
  {
    text: "The Amazon Rainforest, located mostly in Brazil, produces about 20% of the world's oxygen.", 
    country: "Brazil"
  }, 
  {
    text: "Switzerland has four national languages: German, French, Italian, and Romansh.",
    country: "Switzerland"
  },
  {
    text: "The Great Pyramid of Giza was the tallest human-made structure in the world for over 3,800 years!",
    country: "Egypt"
  }, 
  {
    text: "Canada has the longest coastline in the world, stretching over 202,000 km!",
    country: "Canada"
  },{
    text: "There are more kangaroos in Australia than people!", 
    country: "Australia"
  },{
    text: "The city of Istanbul is the only city in the world that sits on two continents (Europe and Asia).", 
    country: "Turkey"
  }, 
  {
    text: "South Korea has some of the fastest internet speeds in the world.", 
    country: "South Korea"
  }, 
  {
    text: "Australia is home to the world's longest straight railway track, stretching 478 kilometers across the Nullarbor Plain!",
    country: "Australia"
  }
];

// home page
app.get('/', (req, res) => {
  res.send('Hello');
  console.log('working');
});
// country page
app.get('/country', (req, res) => {
  // storing query into variable
  const country = req.query.country || req.query.name;
  // declaring result as global variable so that it can be used in both if condition
  let result; 
  // if condition for when query is input or not
  if(country){
    // when query is applied-filter and store it in result case insensitive
    result = factsData.filter((f) => f.country.toLowerCase() === country.toLowerCase());
  } else{
    // initial case where no query is applied 
    result = factsData;
  }
  // if condn only for arrays has something 
  if(result.length > 0){
    // getting random result fact from data and storing it in variable 
    const randomFact = result[Math.floor(Math.random() * result.length)];
    // sending reply
    res.status(200).send(randomFact.text);
  } else {
    // case where data doesn't exist in array data 
    res.status(404).send('No fact in data');
  }
  
})
// Start the server 
app.listen(port, () => {
  console.log(`Server is listening to port: ${port}`);
});