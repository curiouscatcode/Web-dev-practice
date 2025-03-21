// 5️⃣ Student Grades API 
//    - Store students' names and grades.  
//    - `GET /students` → Returns all students with grades.  
//    - `GET /students?grade=A` → Returns students with grade "A".  
//    - `POST /students` → Adds a new student.  
//    - `PUT /students/:id` → Updates a student's grade.
const express = require('express');
const app = express();
const port = 5000;

//middleware
app.use(express.json());

// data
const studentsData = [
  { id: 1, name: "Aman Sharma", grade: "A" },
  { id: 2, name: "Priya Verma", grade: "B" },
  { id: 3, name: "Rahul Gupta", grade: "A" },
  { id: 4, name: "Sneha Patil", grade: "C" },
  { id: 5, name: "Vikram Singh", grade: "B" },
  { id: 6, name: "Neha Iyer", grade: "A" },
  { id: 7, name: "Kunal Rao", grade: "C" },
  { id: 8, name: "Pooja Das", grade: "B" },
  { id: 9, name: "Arjun Mehta", grade: "A" },
  { id: 10, name: "Meera Nair", grade: "B" }
];

// home page
app.get('/', (req,res) => {
  res.status(200).send('Hello. Welcome to home page.');
})

// get (read)
// for queries and random
app.get('/students', (req, res) => {
  const { id, name, grade } = req.query;
  let result = studentsData;

  // If no query params, return all students
  if (!id && !name && !grade) {
    return res.status(200).json(studentsData);
  }

  // Apply filters correctly
  if (id) {
    const studentID = Number(id);
    result = result.filter(student => student.id === studentID);
  }
  if (name) {
    result = result.filter(student => student.name.toLowerCase() === name.toLowerCase());
  }
  if (grade) {
    result = result.filter(student => student.grade.toLowerCase() === grade.toLowerCase());
  }

  // If no students found, return 404
  if (result.length === 0) {
    return res.status(404).json({ error: 'No data found.' });
  }

  // Return all matching students (not just one)
  return res.status(200).json(result);
});

// post (create)
app.post('/students', (req,res) => {
  // 1. url params
  const { id, name, grade } = req.body;
  // 2. edge case 
  if(!id || !name || !grade){
    res.status(400).json({
      error: 'Please provide id, name & grade.'
    });
  }
  // 2.a another edge case 
  const studentID = Number(id);
  if(studentsData.some((s) => s.id === studentID)){
    res.status(400).send('A student with this id already exist.');
  }

  // 3. push
  studentsData.push({ id, name, grade });
  // 4. response
  res.status(200).send(`
      <strong>Data posted Successfully.</strong>
    `)
});

// put (update)
app.put('/students/:id', (req,res) => {
  // 1.search using find
  const studentID = Number(req.params.id);
  const students = studentsData.find((s) => s.id === studentID);

  // 2. edge case 
  if(!req.body.name || !req.body.grade){
    res.status(400).json({
      error: 'Name and grade are required !'
    });
  }
    // 3. if condition
    if(students){
      // 3.a. update
      students.name = req.body.name;
      students.grade = req.body.grade;
      // 3.b. response
      res.status(200).json({
        message: 'Data successfully updated!', 
        students
      });
    } else{
      res.status(400).json({
        error: 'No such data exist to update!'
      });
    }
});

// delete (delete)
// 1. define the route
app.delete('/students/:id', (req,res) => {
  // 2. find index of to be deleted data using find index
  const studentID = Number(req.params.id);
  const index = studentsData.findIndex((s) => s.id === studentID);
  // 3. if (index !== -1)
  if(index !== -1){
    // 4. remove the data 
    studentsData.splice(index, 1);
    // 5. a. response positive
    res.status(200).json({
      message: 'Selected data deleted successfully !'
    });
  } else{
    // 5.b. error response
    res.status(404).json({
      error: 'No such data found to be deleted!'
    });
  }
});

// server starts
app.listen(port, () => {
  console.log(`Server is listening to port ${5000}`);
});