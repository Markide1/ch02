document.addEventListener("DOMContentLoaded", () => {
  new TodoApp();
});

class TodoApp {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
    this.todoInput = document.getElementById("todoInput");
    this.addButton = document.getElementById("addButton");
    this.todoList = document.querySelector(".todo-list");

    this.addButton.addEventListener("click", () => this.addTodo());
    this.renderTodos();
  }

  addTodo() {
    const rawText = this.todoInput.value;
    const text = rawText.trim();

    if (!text) {
      alert("Please enter a to-do item.");
      return;
    }

    if (/^\d+$/.test(text)) {
      alert("To-do item cannot be numbers only.");
      return;
    }

    if (this.isDuplicate(text)) {
      alert("This to-do item already exists.");
      return;
    }

    const todo = {
      id: Date.now(),
      text: text,
    };

    this.todos.push(todo);
    this.saveTodos();
    this.renderTodos();
    this.todoInput.value = "";
  }

  isDuplicate(newText) {
    const normalized = newText.trim().toLowerCase();
    return this.todos.some(
      (todo) => todo.text.trim().toLowerCase() === normalized
    );
  }

  editTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    const newText = prompt("Edit todo:", todo.text);
    if (newText !== null && newText.trim() !== "") {
      if (/^\d+$/.test(newText.trim())) {
        alert("To-do item cannot be numbers only.");
        return;
      }
      if (this.isDuplicate(newText.trim())) {
        alert("This to-do item already exists.");
        return;
      }
      todo.text = newText.trim();
      this.saveTodos();
      this.renderTodos();
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.saveTodos();
    this.renderTodos();
  }

  saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }
  renderTodos() {
    this.todoList.innerHTML = "";
    this.todos.forEach((todo) => {
      const todoElement = document.createElement("div");
      todoElement.className = "todo-item";
      todoElement.innerHTML = `
        <span>${todo.text}</span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;

      const editBtn = todoElement.querySelector(".edit-btn");
      const deleteBtn = todoElement.querySelector(".delete-btn");

      editBtn.addEventListener("click", () => this.editTodo(todo.id));
      deleteBtn.addEventListener("click", () => this.deleteTodo(todo.id));

      this.todoList.appendChild(todoElement);
    });
  }
}
