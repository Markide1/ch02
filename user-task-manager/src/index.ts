
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
  createTask(name: string, email: string): Task;
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
    if (index == -1) return false;

    this.users[index] = { ...this.users[index], ...data };
    return true;
  }

  deleteUser(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index == -1) return false;

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
    return this.tasks.find((p) => p.id === id) || null;
  }

  updateTask(id: string, data: Partial<Task>): boolean {
    const index = this.tasks.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.tasks[index] = { ...this.tasks[index], ...data };
    return true;
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((p) => p.id === id);
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

const user1 = userManager.createUser("Markide One", "markide@outlook.com");
const user2 = userManager.createUser("Sonia Kami", "kami@gmail.com");
const user3 = userManager.createUser("Kevin Kimani", "kimani1@yahoo.com");

userManager.updateUser(1, { name: "Markide Updated", email: "markide.updated@outlook.com" });

userManager.deleteUser(3);


console.log("\nAll Users:");
userManager.getAllUsers().forEach(user => {
  console.log(`${user.name} (${user.email})`);
});



const task1 = taskManager.createTask(
  "Website CSS design",
  "T2G website design task"
);

const task2 = taskManager.createTask(
  "Typescript task manager",
  "A simple commandline for task manager"
);

taskManager.updateTask(task1.id, { name: "Revised Design", description: "Use T2G designs with new features" });

taskManager.deleteTask(task2.id);

taskManager.addUserToTask(task1.id, user1.id);
taskManager.addUserToTask(task1.id, user2.id);
taskManager.addUserToTask(task1.id, user3.id);

taskManager.addUserToTask(task2.id, user2.id);

taskManager.removeUserFromTask(task1.id, user2.id);


console.log("\nAll Tasks:");

const allTasks = taskManager.getAllTasks();

allTasks.forEach((task) => {
  console.log(`\nTask: ${task.name}`);
  console.log(`\nDescription: ${task.description}`);
  console.log("\nAssigned Users:");
  task.users.forEach((user) => {
    console.log(`${user.name} (${user.email})`);
  });
});
