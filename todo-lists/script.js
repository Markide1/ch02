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

}