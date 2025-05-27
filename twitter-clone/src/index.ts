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
let currentUser: User | null = null;

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
    <div class="mobile-comments" id="mobile-comments-${post.id}"></div>
  `;

  posts.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.engagement-item')) {
      return;
    }

    const isCurrentlyActive = posts.classList.contains('active');
    const mobileCommentsContainer = posts.querySelector('.mobile-comments') as HTMLElement;
    
    if (window.innerWidth < 768) {
      if (isCurrentlyActive && mobileCommentsContainer?.classList.contains('show')) {
    
        mobileCommentsContainer.classList.remove('show');
        posts.classList.remove('active');
        return;
      }
    }
    
    const allPosts = document.querySelectorAll('.posts');
    allPosts.forEach(p => {
      p.classList.remove('active');
      const mobileComments = p.querySelector('.mobile-comments') as HTMLElement;
      if (mobileComments) {
        mobileComments.classList.remove('show');
      }
    });
    
    posts.classList.add('active');
    selectedPostId = post.id;

    if (window.innerWidth >= 768) {
      showCommentsForPost(post.id);
      updateCommentsHeader(post.id);
    }

    showMobileComments(post.id);
  });

  userTweet?.appendChild(posts);
}

function createComments(comment: Comment, user: User) {
  const comments = document.createElement("div");
  comments.className = "comment";
  comments.innerHTML = `
    <div class="comment-header">
      <img src="user.png" />
      <div>
        <h2>${user.name} <i class="fa-solid fa-circle-check" style="color: #1da1f2;"></i>
        <i class="fa-brands fa-square-twitter" style="color: #1da1f2; margin-left: 0.5rem;"></i></h2>
        <p style="margin: 0; font-size: 0.85rem; color: #657786;">@${user.username}</p>
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

function showMobileComments(postId: number) {
  const mobileCommentsContainer = document.getElementById(`mobile-comments-${postId}`);
  if (!mobileCommentsContainer || !currentUser) return;

  if (window.innerWidth >= 768) {
    mobileCommentsContainer.classList.remove('show');
    return;
  }

  const postComments = currentComments.filter(
    (comment) => comment.postId === postId
  );

  if (postComments.length === 0) {
    mobileCommentsContainer.classList.remove('show');
    return;
  }

  mobileCommentsContainer.innerHTML = `
    <h4>Post ${postId} Comments (${postComments.length})</h4>
  `;

  postComments.forEach((comment, index) => {
    const commentElement = createComments(comment, currentUser!);
    commentElement.style.animationDelay = `${index * 0.1}s`;
    mobileCommentsContainer.appendChild(commentElement);
  });

  requestAnimationFrame(() => {
    mobileCommentsContainer.classList.add('show');
  });
}

function showCommentsForPost(postId: number) {
  if (!userComments || !currentUser) return;

  userComments.innerHTML = "";

  const postComments = currentComments.filter(
    (comment) => comment.postId === postId
  );
  
  postComments.forEach((comment) => {
    const commentElement = createComments(comment, currentUser!);
    userComments.appendChild(commentElement);
  });
}

function updateCommentsHeader(postId: number) {
  if (!commentsHeader) return;
  const postComments = currentComments.filter((c) => c.postId === postId);
  commentsHeader.textContent = `Post ${postId} Comments (${postComments.length})`;
}

async function loadUsers() {
  const users = await fetchJSON(USERS_API);
  users.forEach(createUserOption);
  loadUser(users[0].id);
}

async function loadUser(userId: number) {
  try {
    const user: User = await fetchJSON(`${USERS_API}/${userId}`);
    currentUser = user;
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
      if (window.innerWidth >= 768) {
        showCommentsForPost(selectedPostId);
        updateCommentsHeader(selectedPostId);
      } else {
        showMobileComments(selectedPostId);
      }
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    document.querySelectorAll('.mobile-comments').forEach(container => {
      (container as HTMLElement).classList.remove('show');
    });
    
    showCommentsForPost(selectedPostId);
    updateCommentsHeader(selectedPostId);
  } else {
    const activePost = document.querySelector('.posts.active');
    if (activePost) {
      const postId = parseInt(activePost.getAttribute('data-post-id') || '1');
      showMobileComments(postId);
    }
  }
});

userSelect.addEventListener("change", () => {
  loadUser(parseInt(userSelect.value));
});

loadUsers();