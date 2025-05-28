//3️⃣ Motivational Quotes API 
//   - Store motivational quotes from famous people.  
//   - `/quote` → Returns a random quote.  
//   - `/quote?author=Einstein` → Returns a quote from Einstein.  
// boiler plate code
const express = require('express');
const app = express();
const port = 4000;
const path = require('path');
// importing static file
app.use(express.static(path.join(__dirname, 'public')));
// middleware for json
app.use(express.json());
// data
const QuotesData = [
  { quote: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein" },
  { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { quote: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
  { quote: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" }
];

// Home page
app.get('/', (req,res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/quote', (req,res) => {
  // query parameter
  const { quote, author } = req.query;
  // result global variable
  let result = QuotesData;
  // if conditions
  if(author){
    // filter out case insensitive
    result = QuotesData.filter((f) => f.author.toLowerCase() === author.toLowerCase());
  } 
  if(quote){
    result = QuotesData.filter((m) => m.quote.toLowerCase() === quote.toLowerCase());
  }
  // another if condition
  if(result.length > 0){
    const randomQuote = result[Math.floor(Math.random() * result.length)];
    res.status(200).json(randomQuote);
  } else{
    res.status(404).send('Quote not found');
  }
});

// post 
app.post('/quote', (req, res) => {
  const { quote, author } = req.body;
  // if case
  if(!quote || !author){
    return res.status(404).json({
      error: 'Please provide both quote & author'
    });
  }
  QuotesData.push({ quote, author });
  res.status(200).send(`
    <strong>Quote and author was added successfully.</strong>
  `)
});

// server start
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});