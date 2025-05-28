// 7️⃣ Emoji Meaning API
//  - Store emojis and their meanings.  
//  - `/emoji` → Returns a random emoji and its meaning.  
//  - `/emoji?name=fire` → Returns 🔥 and its meaning.  
// boiler plate code
const express = require('express');
const app = express();
const port = 4000;

const emojiData = [
  { emoji: "🔥", name: "fire", meaning: "Represents heat, passion, or something cool and trendy." },
  { emoji: "😂", name: "joy", meaning: "A face with tears of joy, used to express laughter and amusement." },
  { emoji: "❤️", name: "heart", meaning: "Symbolizes love, affection, and deep emotions." },
  { emoji: "🚀", name: "rocket", meaning: "Represents speed, innovation, and progress." },
  { emoji: "🌟", name: "star", meaning: "Used to signify something special, shining, or outstanding." },
  { emoji: "💡", name: "idea", meaning: "Represents an idea, creativity, or a bright thought." },
  { emoji: "🎉", name: "celebration", meaning: "Used for celebrations, parties, and happy occasions." },
  { emoji: "⏳", name: "hourglass", meaning: "Symbolizes waiting, time running out, or patience." },
  { emoji: "🌍", name: "earth", meaning: "Represents the planet, nature, or global topics." },
  { emoji: "🤖", name: "robot", meaning: "Represents artificial intelligence, robots, or technology." }
];

// home page
app.get('/', (req, res) => {
  res.send('Home Page');
  console.log('Working');
});

app.get('/emoji', (req, res) => {
  // query parameters
  const { name, emoji, meaning } = req.query;  
  //const meaning = req.query.meaning;
  // global variable for result //also, =emojiData because to represent normal case which can't be shown since else if case is not there 
  let result = emojiData;
  // if condition for name, emoji, meaning 
  // separate it out since all won't execute in else if cases 
  if(name){
    // filter out the data
    result = emojiData.filter((f) => f.name.toLowerCase() === name.toLowerCase());
  }
  if(emoji){
    result = emojiData.filter((f) => f.emoji === emoji);
  }
  if(meaning){
    result = emojiData.filter((f) => f.meaning.toLowerCase() === meaning.toLowerCase());
  }
  // if condition for 
  if(result.length > 0){
    // mathRandom
    const randomEmoji = result[Math.floor(Math.random() * result.length)];
    res.status(200).send(
      `<h1>Emoji: ${randomEmoji.emoji}</h1> <br>
       <h2>Name: ${randomEmoji.name}</h2> <br>
       <h2>Meaning: ${randomEmoji.meaning}</h2>`
    );
  } else {
    res.status(404).send('Emoji not found');
  }
});

// start server 
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});