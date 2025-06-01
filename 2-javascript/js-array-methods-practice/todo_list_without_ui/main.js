let todos = [
  { id: 1, task: "Learn React", completed: false },
  { id: 2, task: "Practice JS array methods", completed: true },
  { id: 3, task: "Read a book", completed: false },
];

// 1. ✅ **Get all completed tasks**
// const completedTasks = todos.filter((todo) => todo.completed === true);

// console.log(completedTasks);

// 2. 🔍 **Find task by id**
// const id = 2;
// const task = todos.find((todos) => todos.id === id);

// console.log(task);

// 3. 🚫 **Remove a task by id**

// const newTask = todos.filter((todo) => todo.id !== id);

// console.log(newTask);

// 4. ➕ **Add a new task (uncompleted by default)**
// const newTask = {
//   id: 4,
//   task: "Commit Suicide",
//   completed: false,
// };

// const updatedTodos = [...todos, newTask];
// console.log(updatedTodos);

// 5. 🔁 **Toggle a task’s completed status**

// const id = 3;

// const updatedTodos = todos.map((todo) => {
//   if (todo.id === id) {
//     return {
//       ...todo,
//       completed: !todo.completed, // toggle the status
//     };
//   } else {
//     return todo; // keep the rest unchanged
//   }
// });

// console.log(updatedTodos);

// 6. 📋 **Get a list of only task names sorted alphabetically**
const list = todos.map((todo) => todo.task).sort();
console.log(list);
