// 1️⃣ To-Do List API
//     - Store tasks with `title`, `description`, and `status`.  ✅
//     - `GET /tasks` → Returns all tasks.  ✅
//     - `POST /tasks` → Adds a new task.  ✅
//     - `PUT /tasks/:id` → Updates a task's status.✅  (could have used patch for partial update)
//     - `DELETE /tasks/:id` → Deletes a task.  ✅
// boiler plate code
const express = require('express');
const app = express();
const port = 5000;

// middleware for json
app.use(express.json());

// data
const tasksData = [
  { id: 1, title: "Buy groceries", description: "Milk, Eggs, Bread", status: "pending" },
  { id: 2, title: "Finish project", description: "Submit by Friday", status: "in progress" },
  { id: 3, title: "Workout", description: "Run 5km", status: "completed" },
  { id: 4, title: "Read a book", description: "Read 30 pages of a novel", status: "pending" },
  { id: 5, title: "Call mom", description: "Catch up on the week", status: "in progress" },
  { id: 6, title: "Clean room", description: "Organize desk and wardrobe", status: "pending" },
  { id: 7, title: "Write blog", description: "Draft next tech blog post", status: "pending" },
  { id: 8, title: "Meditate", description: "10 minutes of mindfulness", status: "completed" },
  { id: 9, title: "Fix bug", description: "Debug issue in API response", status: "in progress" },
  { id: 10, title: "Plan weekend", description: "Decide movie and dinner spot", status: "pending" }
];

// get (read)
app.get('/tasks', (req,res) => {
  // query params 
  const { id, title, description, status } = req.query;
  // global variable result
  let result = tasksData;
  // condition with no queries 
  if(!id && !title && !description && !status){
    return res.status(200).send(tasksData);
  }
  // if conditions 
  if(id){
    // filtering out , case insensitive
    const taskID = Number(id);
    result = tasksData.filter((i) => i.id === taskID);
  }
  if(title){
    result = tasksData.filter((t) => t.title.toLowerCase() === title.toLowerCase());
  }
  if(description){
    result = tasksData.filter((d) => d.description.toLowerCase() === description.toLowerCase());
  }
  if(status){
    result = tasksData.filter((s) => s.status.toLowerCase() === status.toLowerCase());
  }

  // if result.length === 0 case
  if(result.length === 0){
    res.status(400).send('No data avalaible');
  }

  // response for queries 
  res.status(200).send(result);
});

// post (create)
app.post('/tasks', (req,res) => {
  // params 
  const { id, title, description, status } = req.body;
  // edge case 
  if(!id || !title || !description || !status){
    return res.status(400).json({
      error: 'Please provide all four requirements: id, title, description, status.'
    });
  }
  // another edge case (if id already exists)
  const taskID = Number(id);
  if (tasksData.some((f) => f.id === taskID)){
    return res.status(400).json({
      error: 'Task with this id already exists!'
    });
  }
  // push the task
  tasksData.push({ id, title, description, status });
  // response 
  res.status(200).json({
    message: 'Data posted successfully !'
  });
});

// put (update)
// 1. define the route
app.put('/tasks/:id', (req,res) => {
  // 2. find the task that needs to be updated using find 
  const tasksID = Number(req.params.id);
  const task = tasksData.find((f) => f.id === tasksID); 
  
  // 3.b. User doesn't inputs all the required data to be update 
  if(!req.body.status){
    return res.status(404).json({
      error: 'Please provide the all changed data.'
    });
  }
  // 4. update
  if(task){
    // 4.a. update 
    task.status = req.body.status;
    // 4.b. response
    res.status(200).json({
      message: 'Task successfully updated !',
      task
    });
  } else{
    res.status(404).json({
      error: 'No such task found!'
    });
  }
});

// Delete (delete)
//1. define the route
app.delete('/tasks/:id', (req,res) => {
  // 2. find the index of the task that needs to be deleted using findIndex
  const taskID = Number(req.params.id);
  const index = tasksData.findIndex((f) => f.id === taskID);
  // 3. if condition (index !== -1)
  if(index !== -1){
    // 4. delete the task using splice 
    tasksData.splice(index, 1);
    // 5. response 
    res.status(200).json({
      message: 'Required task has been deleted successfully !'
    });
  } else {
    res.status(404).json({
      error: 'No such data found to be deleted !'
    });
  }
});

// patch
// patch (partial update)
app.patch('/tasks/:id', (req, res) => {
  const taskID = Number(req.params.id);
  const task = tasksData.find((f) => f.id === taskID);

  // If the task doesn't exist
  if (!task) {
    return res.status(404).json({
      error: 'No such task found!',
    });
  }

  // Only update the fields that are provided in the request body
  if (req.body.title) task.title = req.body.title;
  if (req.body.description) task.description = req.body.description;
  if (req.body.status) task.status = req.body.status;

  // Response after update
  res.status(200).json({
    message: 'Task successfully updated!',
    task,
  });
});

// home page
app.get('/', (req,res) => {
  res.status(200).send('Hello. Welcome to home page!');
});

// server starts
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});

