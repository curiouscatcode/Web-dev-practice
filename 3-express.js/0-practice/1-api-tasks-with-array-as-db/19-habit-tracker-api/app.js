// 1️⃣9️⃣ Habit Tracker API  
// - Users can add daily habits they want to track (e.g., "Drink Water", "Exercise").  
// - Routes for adding, updating, deleting, and marking habits as completed for the day.  
// - Bonus: Track streaks (e.g., "Exercise - 5 days in a row").  
const express = require('express');
const app = express();
const port = 5000;

// middleware to parse json
app.use(express.json());

const habitsData = [
  { id: 1, name: "Drink Water", completed: false, streak: 3 },
  { id: 2, name: "Exercise", completed: true, streak: 5 },
  { id: 3, name: "Read a Book", completed: false, streak: 2 },
  { id: 4, name: "Meditate", completed: true, streak: 7 },
  { id: 5, name: "Wake Up Early", completed: false, streak: 1 }
];

// home page
app.get('/', (req,res) => {
  res.status(200).send('Welcome to home page !');
});

// CRUD operations 
// CREATE (post)
app.post('/habits', (req,res) => {
  // 1. parameter 
  const { id, name, completed, streak } = req.body;

  // 2. edge cases
  if(!id || !name || !completed || !streak){
    return res.status(400).json({
      error: 'Please provide all the required fields !'
    });
  }

  // edge cases-2: if habit it current id already exists 
  const habitsID = Number(id);
  if(habitsData.some((f) => f.id === habitsID)){
    return res.status(400).json({
      error: 'Habit with this id already exists !'
    });
  }

  // 3. post : in case of arrays use push method
  habitsData.push({id, name, completed, streak});

  // 4. response 
  res.status(200).json({
    message: 'Habit pushed successfully !'
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});