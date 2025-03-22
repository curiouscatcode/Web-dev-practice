const todoList = [{
  name: 'wash dishes',
  dueDate: '10/02/2024'
}, {
  name: 'complete js project',
  dueDate: '02/2/2024'
}];

function renderTodoList() {
  //Accumulator variable
  let todoListHTML = '';

  todoList.forEach(todoObject, index) {
    const { name, dueDate } = todoObject;

    const html = `<div class="css-task-1">wash dishes</div>
        <div class="due-date">10/02/2024</div>
        <button class="css-delete-btn js-delete-btn">
          Delete
        </button>`;

    todoListHTML += html;
  }
}