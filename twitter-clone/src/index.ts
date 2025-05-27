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
const userTweet = document.getElementById("userstweet");
const userComments = document.getElementById("userscomments");
const commentsHeader = document.getElementById("comments-header");

const USERS_API = "https://jsonplaceholder.typicode.com/users";
const POSTS_API = "https://jsonplaceholder.typicode.com/posts";
const COMMENTS_API = "https://jsonplaceholder.typicode.com/comments";

let currentPosts: Post[] = [];
let currentComments: Comment[] = [];
let selectedPostId: number = 1;

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
    <img src="user.png" />
    <div class="profile-info">
      <h2>${user.name}</h2>
      <p>@${user.username}</p>
      <p>${user.email}</p>
      <p>${user.company.name}</p>
      <p><i class="fas fa-map-marker-alt"></i> ${user.address.city}</p>
    </div>
  `;
}

function createPosts(post: Post, user: User, index: number) {
  const posts = document.createElement("div");
  posts.className = "posts";
  posts.dataset.postId = String(post.id);
  if (index === 0) posts.classList.add("active");

  posts.innerHTML = `
    <div class="post-header">
      <img src="user.png" />
      <div class="post-info">
        <h2>${user.name} <i class="fa-solid fa-circle-check" style="color: #1da1f2; font-size: 0.8rem;">
        </i><i class="fa-brands fa-square-twitter" style="color: #1da1f2; font-size: 0.9rem; margin-left: 0.5rem;"></i></h2>
      </div>
    </div>
    <div class="post-body">${post.body}</div>
    <div class="post-engagement">
      <div class="engagement-item comments">
        <i class="far fa-comment"></i>
        <span>200</span>
      </div>
      <div class="engagement-item retweets">
        <i class="fas fa-retweet"></i>
        <span>200</span>
      </div>
      <div class="engagement-item likes">
        <i class="fa-solid fa-heart"></i>
        <span>200</span>
      </div>
    </div>
  `;

  userTweet?.appendChild(posts);
}

function createComments(comment: Comment) {
  const comments = document.createElement("div");
  comments.className = "comment";
  comments.innerHTML = `
    <div class="comment-header">
      <img src="user.png" />
      <div>
        <h2>${comment.name} <i class="fa-solid fa-circle-check" style="color: #1da1f2;"></i>
        <i class="fa-brands fa-square-twitter" style="color: #1da1f2; margin-left: 0.5rem;"></i></h2>
      </div>
    </div>
    <p class="comment-body">${comment.body}</p>
    <div class="post-engagement">
      <div class="engagement-item comments">
        <i class="far fa-comment"></i>
        <span>0</span>
      </div>
      <div class="engagement-item retweets">
        <i class="fas fa-retweet"></i>
        <span>0</span>
      </div>
      <div class="engagement-item likes">
        <i class="fa-solid fa-heart"></i>
        <span>0</span>
      </div>
    </div>

  `;
  return comments;
}

function showCommentsForPost(postId: number) {
  if (!userComments) return;

  userComments.innerHTML = "";

  const postComments = currentComments.filter(
    (comment) => comment.postId === postId
  );
  postComments.forEach((comment) => {
    const commentElement = createComments(comment);
    userComments.appendChild(commentElement);
  });
}

function updateCommentsHeader(postId: number) {
  if (!commentsHeader) return;
  const postComments = currentComments.filter((c) => c.postId === postId);
  commentsHeader.textContent = `Post ${postId} Comments`;
}

async function loadUsers() {
  const users = await fetchJSON(USERS_API);
  users.forEach(createUserOption);
  loadUser(users[0].id);
}

async function loadUser(userId: number) {
  try {
    const user: User = await fetchJSON(`${USERS_API}/${userId}`);
    setUserProfile(user);

    if (userTweet) userTweet.innerHTML = "";
    if (userComments) userComments.innerHTML = "";

    const posts: Post[] = await fetchJSON(`${POSTS_API}?userId=${userId}`);
    currentPosts = posts;

    const allComments: Comment[] = await fetchJSON(COMMENTS_API);

    const userPostIds = posts.map((post: Post) => post.id);
    currentComments = allComments.filter((comment: Comment) =>
      userPostIds.includes(comment.postId)
    );

    posts.forEach((post: Post, index: number) => {
      createPosts(post, user, index);
    });

    if (posts.length > 0) {
      selectedPostId = posts[0].id;
      showCommentsForPost(selectedPostId);
      updateCommentsHeader(selectedPostId);
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

userSelect.addEventListener("change", () => {
  loadUser(parseInt(userSelect.value));
});

loadUsers();
