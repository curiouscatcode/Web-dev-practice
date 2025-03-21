//6️⃣ Vocabulary API  
//    - Store words and their meanings.  
//    - `/word` → Returns a random word.  
//    - `/word?letter=A` → Returns a word that starts with "A".  
// boiler plate code
const express = require('express');
const { mean } = require('lodash');
const app = express();
const port = 5000;
// data 
const wordsData = [
  { word: "Apple", meaning: "A fruit that is red or green in color" },
  { word: "Banana", meaning: "A long, curved fruit with yellow skin" },
  { word: "Carrot", meaning: "An orange vegetable that grows underground" },
  { word: "Dog", meaning: "A domesticated carnivorous mammal" },
  { word: "Elephant", meaning: "A large herbivorous mammal with a trunk" },
  { word: "Fan", meaning: "A device that moves air to cool or ventilate" },
  { word: "Guitar", meaning: "A musical instrument with strings" },
  { word: "House", meaning: "A building where people live" },
  { word: "Igloo", meaning: "A dome-shaped house made of ice blocks" },
  { word: "Jungle", meaning: "A dense forest in a tropical region" }
];
// get
app.get('/word', (req,res) => {
  // query parameter
  const { word, meaning } = req.query;
  // result global variable declare
  let result = wordsData;
  // if condition 
  if(word){
    // filter out case insensitive
    result = wordsData.filter((w) => w.word.toLowerCase() === word.toLowerCase());
  }
  if(meaning){
    result = wordsData.filter((m) => m.meaning.toLowerCase() === meaning.toLowerCase());
  }
  let letter = req.query.letter;
  if (letter) {
    result = wordsData.filter((word) => 
      word.toLowerCase().startsWith(letter.toLowerCase())  // Check if word starts with letter
    );
  }

  // if condition
  if(result.length > 0){
    // random
    const randomWord = result[Math.floor(Math.random() * result.length)];
    res.status(200).send(randomWord.word);
    // res.status(200).json(randomWord);
  }
})

//home page
app.get('/', (req,res) => {
  res.status(200).send('Hello. Welcome to home page.');
  //res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// start server
app.listen(port, () => {
  console.log(`Server is listening to port ${5000}`);
});