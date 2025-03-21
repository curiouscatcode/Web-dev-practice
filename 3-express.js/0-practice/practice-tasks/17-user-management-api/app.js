// 6️⃣ User Management API**  
// Create an Express API with the following routes:  
//    - `POST /users` → Create a new user with `{ name, email, age }`  ✅
//    - `GET /users` → Fetch all users  ✅
//    - `GET /users/:id` → Fetch a user by ID  ✅
//    - `PUT /users/:id` → Update a user’s details  ✅
//    - `DELETE /users/:id` → Delete a user  ✅
const express = require('express');
const app = express();
const port = 5000;

// middleware to parse json
app.use(express.json());

// data
const userData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    age: 28,
    role: "admin"
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    age: 22,
    role: "user"
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    age: 30,
    role: "user"
  }
];

// home page
app.get('/', (req,res) => {
  res.status(200).send('Hello. Welcome to home page.');
  // res.status(200).sendFile(paht.join(__dirname, 'public', 'index.html')); if a html file exists!
});

// post (create)
app.post('/users', (req,res) => {
  // query parameter
  const { id, name, email, age, role } = req.body;
  // edge case: if user doesn't input all required things
  if(!id || !name || !email || !age || !role){
    return res.status(400).json({
      error: 'Please provide all required details: id, name, email, age, role'
    });
  }
  // edge case: if user of this id already exists 
  const usersID = Number(id);
  if( userData.some((f) => f.id === usersID)){
    return res.status(400).json({
      error: 'User with this id already exists !'
    });
  }
  // use .push method to add data in data
  userData.push({ id, name, email, age, role });
  // response 
  res.status(200).json({
    message: 'Data posted successfully!'
  });
});

// GET (READ) === ALL USERS!
app.get('/users', (req,res) => {
  res.status(200).send(userData);
});

// GET (READ) === QUERY
app.get('/users/:id', (req,res) => {
  // params
  const id  = req.params.id;
  // global variable result
  let result = userData;
  // if conditions 
  if(id){
    // filtering out
    const userID = Number(req.params.id)
    result = userData.filter((f) => f.id === userID);
  }

  // edge case
  if(result.length === 0){
    return res.status(404).json({
      error: 'No data found !'
    });
  }

  res.status(200).send(result);
});

// PUT (UPDATE)
// 1. define the routw
app.put('/users/:id', (req,res) => {
  const id = req.params.id;
  // 2. find the user with given id that needs to be updated using find
  const usersID = Number(id);
  const users = userData.find((f) => f.id === usersID);

  // 3. edge case where users doens't inputs all the needed inputs
  if(!req.body.id || !req.body.name || !req.body.email || !req.body.age || !req.body.role){
    return res.status(400).json({
      error: 'Please provide all required fields: id, name, email, age, role.'
    });
  }

  // 4. update in if condition
  if(users){
    users.id = req.body.id;
    users.name = req.body.name;
    users.email = req.body.email;
    users.age = req.body.age;
    users.role = req.body.role;

    // 5. response
    res.status(200).json({
      message: 'Data updated successfully !'
    });
  } else{
    res.status(404).json({
      error: 'No data found !'
    });
  }
});

// DELETE (DELETE)
// 1. Define the route
app.delete('/users/:id', (req, res) => {
  // 2. find the index of the data that needs to be deleted usinf 'findIndex' method & store in variable called index
  const usersID = Number(req.params.id);
  const index = userData.findIndex((f) => f.id === usersID);

  // 3. if condition (index !== -1)
  if(index !== -1){
    // 4. delete the data using splice method 
    userData.splice(index, 1);
    // 5. response 
    res.status(200).json({
      message: 'Required data successfully !'
    });
  } else{
    res.status(404).json({
      error: 'No such data found !'
    });
  }
});

// server starts
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});