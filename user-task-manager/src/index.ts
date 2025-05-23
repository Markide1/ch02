interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  users: User[];
}

interface UserManager {
  createUser(name: string, email: string): User;
  getUser(id: number): User | null;
  updateUser(id: number, data: Partial<User>): boolean;
  deleteUser(id: number): boolean;
  getAllUsers(): User[];
}

interface TaskManager {
  createTask(name: string, description: string): Task;
  getTask(id: string): Task | null;
  updateTask(id: string, data: Partial<Task>): boolean;
  deleteTask(id: string): boolean;
  getAllTasks(): Task[];
  addUserToTask(taskId: string, userId: number): boolean;
  removeUserFromTask(taskId: string, userId: number): boolean;
  getTaskUsers(taskId: string): User[];
}

class UserManager implements UserManager {
  private users: User[] = [];
  private lastId: number = 0;

  createUser(name: string, email: string): User {
    const user: User = {
      id: ++this.lastId,
      name,
      email,
    };
    this.users.push(user);
    return user;
  }

  getUser(id: number): User | null {
    return this.users.find((u) => u.id === id) || null;
  }

  updateUser(id: number, data: Partial<User>): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.users[index] = { ...this.users[index], ...data };
    return true;
  }

  deleteUser(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }

  getAllUsers(): User[] {
    return [...this.users];
  }
}

class TaskManager implements TaskManager {
  private tasks: Task[] = [];
  private userManager: UserManager;

  constructor(userManager: UserManager) {
    this.userManager = userManager;
  }

  createTask(name: string, description: string): Task {
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      users: [],
    };
    this.tasks.push(task);
    return task;
  }

  getTask(id: string): Task | null {
    return this.tasks.find((t) => t.id === id) || null;
  }

  updateTask(id: string, data: Partial<Task>): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tasks[index] = { ...this.tasks[index], ...data };
    return true;
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  addUserToTask(taskId: string, userId: number): boolean {
    const task = this.getTask(taskId);
    const user = this.userManager.getUser(userId);

    if (!task || !user) return false;

    if (!task.users.find((u) => u.id === userId)) {
      task.users.push(user);
    }
    return true;
  }

  removeUserFromTask(taskId: string, userId: number): boolean {
    const task = this.getTask(taskId);
    if (!task) return false;

    const index = task.users.findIndex((u) => u.id === userId);
    if (index === -1) return false;

    task.users.splice(index, 1);
    return true;
  }

  getTaskUsers(taskId: string): User[] {
    const task = this.getTask(taskId);
    return task ? [...task.users] : [];
  }
}

const userManager = new UserManager();
const taskManager = new TaskManager(userManager);

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidName = (name: string) => name.trim().length >= 2;

function refreshUI() {
  updateUsersDisplay();
  updateTasksDisplay();
  updateSelects();
}

function updateUsersDisplay() {
  const container = document.getElementById("usersList") as HTMLElement;
  container.querySelectorAll(".singleUser").forEach((el) => el.remove());

  userManager.getAllUsers().forEach((user) => {
    const div = document.createElement("div");
    div.className = "singleUser";
    div.textContent = `${user.name} (${user.email}) - ID: ${user.id}`;
    container.appendChild(div);
  });
}

function updateTasksDisplay() {
  const container = document.getElementById("tasksList") as HTMLElement;
  if (!container) return;

  container.querySelectorAll(".singleTask").forEach((el) => el.remove());

  taskManager.getAllTasks().forEach((task) => {
    const div = document.createElement("div");
    div.className = "singleTask";
    div.innerHTML = `
      <h4>${task.name}</h4>
      <p>${task.description}</p>
      <small>ID: ${task.id} | Users: ${
      task.users.map((u) => u.name).join(", ") || "None"
    }</small>
    `;
    container.appendChild(div);
  });
}

function updateSelects() {
  const users = userManager.getAllUsers();
  const tasks = taskManager.getAllTasks();

  ["updateUserId", "deleteUserId", "assignUserId", "removeUserId"].forEach(
    (id) => {
      const select = document.getElementById(id) as HTMLSelectElement;
      if (select) {
        select.innerHTML = '<option value="">Select user...</option>';
        users.forEach((user) => {
          select.innerHTML += `<option value="${user.id}">${user.name}</option>`;
        });
      }
    }
  );

  ["updateTaskId", "deleteTaskId", "assignTaskId", "removeTaskId"].forEach(
    (id) => {
      const select = document.getElementById(id) as HTMLSelectElement;
      if (select) {
        select.innerHTML = '<option value="">Select task...</option>';
        tasks.forEach((task) => {
          select.innerHTML += `<option value="${task.id}">${task.name}</option>`;
        });
      }
    }
  );
}

document.getElementById("createUserBtn")?.addEventListener("click", () => {
  const nameInput = document.getElementById("userName") as HTMLInputElement;
  const emailInput = document.getElementById("userEmail") as HTMLInputElement;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    alert("Please fill in both fields");
    return;
  }

  if (!isValidName(name) || !isValidEmail(email)) {
    alert("Please enter valid name and email");
    return;
  }

  userManager.createUser(name, email);
  nameInput.value = "";
  emailInput.value = "";
  refreshUI();
  alert("User created successfully");
});

function updateUser() {
  const userId = parseInt(
    (document.getElementById("updateUserId") as HTMLSelectElement).value
  );
  const name = (
    document.getElementById("updateUserName") as HTMLInputElement
  ).value.trim();
  const email = (
    document.getElementById("updateUserEmail") as HTMLInputElement
  ).value.trim();

  if (!userId) {
    alert("Please select a user");
    return;
  }

  if (!name && !email) {
    alert("Please provide at least one field to update");
    return;
  }

  const updateData: Partial<User> = {};
  if (name && isValidName(name)) updateData.name = name;
  if (email && isValidEmail(email)) updateData.email = email;

  if (userManager.updateUser(userId, updateData)) {
    (document.getElementById("updateUserName") as HTMLInputElement).value = "";
    (document.getElementById("updateUserEmail") as HTMLInputElement).value = "";
    refreshUI();
    alert("User updated successfully");
  } else {
    alert("Update failed");
  }
}

function deleteUser() {
  const userId = parseInt(
    (document.getElementById("deleteUserId") as HTMLSelectElement).value
  );

  if (!userId) {
    alert("Please select a user");
    return;
  }

  if (confirm("This will remove a user!")) {
    if (userManager.deleteUser(userId)) {
      refreshUI();
      alert("User deleted successfully");
    } else {
      alert("Delete failed");
    }
  }
}

function createTask() {
  const nameInput = document.getElementById("taskName") as HTMLInputElement;
  const descInput = document.getElementById(
    "taskDescription"
  ) as HTMLTextAreaElement;

  const name = nameInput.value.trim();
  const description = descInput.value.trim();

  if (!name || !description) {
    alert("Please fill in both fields");
    return;
  }

  taskManager.createTask(name, description);
  nameInput.value = "";
  descInput.value = "";
  refreshUI();
  alert("Task created successfully");
}

function updateTask() {
  const taskId = (document.getElementById("updateTaskId") as HTMLSelectElement)
    .value;
  const name = (
    document.getElementById("updateTaskName") as HTMLInputElement
  ).value.trim();
  const description = (
    document.getElementById("updateTaskDescription") as HTMLTextAreaElement
  ).value.trim();

  if (!taskId) {
    alert("Please select a task");
    return;
  }

  if (!name && !description) {
    alert("Please provide at least one field to update");
    return;
  }

  const updateData: Partial<Task> = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;

  if (taskManager.updateTask(taskId, updateData)) {
    (document.getElementById("updateTaskName") as HTMLInputElement).value = "";
    (
      document.getElementById("updateTaskDescription") as HTMLTextAreaElement
    ).value = "";
    refreshUI();
    alert("Task updated successfully");
  } else {
    alert("Update failed");
  }
}

function deleteTask() {
  const taskId = (document.getElementById("deleteTaskId") as HTMLSelectElement)
    .value;

  if (!taskId) {
    alert("Please select a task");
    return;
  }

  if (confirm("Do you really want to delete?")) {
    if (taskManager.deleteTask(taskId)) {
      refreshUI();
      alert("Task deleted successfully");
    } else {
      alert("Delete failed");
    }
  }
}

function assignUserToTask() {
  const taskId = (document.getElementById("assignTaskId") as HTMLSelectElement)
    .value;
  const userId = parseInt(
    (document.getElementById("assignUserId") as HTMLSelectElement).value
  );

  if (!taskId || !userId) {
    alert("Please select both task and user");
    return;
  }

  if (taskManager.addUserToTask(taskId, userId)) {
    refreshUI();
    alert("Task assigned successfully");
  } else {
    alert("Assignment failed");
  }
}

function removeUserFromTask() {
  const taskId = (document.getElementById("removeTaskId") as HTMLSelectElement)
    .value;
  const userId = parseInt(
    (document.getElementById("removeUserId") as HTMLSelectElement).value
  );

  if (!taskId || !userId) {
    alert("Please select both task and user");
    return;
  }

  if (taskManager.removeUserFromTask(taskId, userId)) {
    refreshUI();
    alert("Task unassigned successfully");
  } else {
    alert("Removal failed");
  }
}

function showMessage(message: string, isError: boolean = false): void {
  const prefix = isError ? "Error: " : "Success: ";
  alert(prefix + message);
}


document.addEventListener("DOMContentLoaded", refreshUI);