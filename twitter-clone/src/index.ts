interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
    website: string;
    phone: string;
}

interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

interface Comment {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
}

const userSelect = document.getElementById("usersnames") as HTMLSelectElement;
const userProfile = document.getElementById("usersprofile")!;

const USERS_API = "https://jsonplaceholder.typicode.com/users";

async function fetchJSON(url: string) {
    const res = await fetch(url);
    return res.json();
}

function createUserOption(user: User) {
    const option = document.createElement("option");
    option.value = String(user.id);
    option.textContent = user.name;
    userSelect.appendChild(option);
}

function setUserProfile(user: User) {
    userProfile.innerHTML = `
    <img src= "user.png" />
    <div class="profile-info">
      <h2>${user.name}</h2>
      <p>@${user.username}</p>
      <p>${user.email}</p>
      <p>${user.company.name}</p>
      <p><i class="fas fa-map-marker-alt"></i> ${user.address.city}</p>
    </div>
  `;
}

async function loadUsers() {
    const users = await fetchJSON(USERS_API);
    users.forEach(createUserOption);
    loadUser(users[0].id);
}

async function loadUser(userId: number) {
    const [user] = await Promise.all([fetchJSON(`${USERS_API}/${userId}`)]);
    setUserProfile(user);
}

userSelect.addEventListener("change", () => {
    loadUser(parseInt(userSelect.value));
});

loadUsers();
