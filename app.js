const k3Container = document.querySelector("#k3-comments");
const commentsList = k3Container.querySelector("ul");
const statusEl = k3Container.querySelector("#k3-status");
const loader = k3Container.querySelector("#k3-loader");
const signinForm = k3Container.querySelector("#k3-signin-form");
const signupForm = k3Container.querySelector("#k3-signup-form");
const createCommentForm = k3Container.querySelector("#k3-create-form");
const commentList = k3Container.querySelector("#k3-comments-list");
const sort = k3Container.querySelector("#k3-sort");
const usernameEl = k3Container.querySelector("#k3-username");
const signInButton = k3Container.querySelector("#k3-signin-link");
const signUpButton = k3Container.querySelector("#k3-signup-link");
const authTabs = k3Container.querySelector("#k3-auth-tabs");

const PERFORMER_URL = "https://operator-performer-01-bcg2tu5n4q-uc.a.run.app";

const CID = "QmVDc2xdUh9g9pfPvM1MqZzgFtSUnrzZhxHcbsNEVNTK9r";

const parentUrl = new URLSearchParams(window.location.search).get("parentUrl");
const location = btoa(parentUrl);
console.log(parentUrl);
if (localStorage.getItem("k3-auth")) {
  const username = atob(localStorage.getItem("k3-auth"))?.split(":")[0] || "";

  usernameEl.textContent = username;
  usernameEl.style.display = "block";
}

const updateForms = () => {
  if (localStorage.getItem("k3-auth")) {
    signinForm.style.visibility = "hidden";
    signupForm.style.visibility = "hidden";
    signinForm.style.display = "none";
    signupForm.style.display = "none";
    authTabs.style.display = "none";

    createCommentForm.style.visibility = "visible";
    createCommentForm.style.display = "block";
  } else {
    createCommentForm.style.visibility = "hidden";
    createCommentForm.style.display = "none";

    signinForm.style.visibility = "visible";
    signupForm.style.visibility = "visible";
    authTabs.style.display = "flex";
  }
};

const updateComments = async () => {
  const sortBy = sort.value;
  statusEl.textContent = "Loading comments...";
  loader.style.visibility = "visible";
  commentList.classList.add("animate-pulse");

  const rawRes = await fetch(`${PERFORMER_URL}/execute/${CID}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      method: "GET",
      url: `/api/comments?url=${location}`,
      body: "",
      headers: {},
    }),
  });
  commentList.classList.remove("animate-pulse");
  const res = await rawRes.json();
  loader.style.visibility = "hidden";
  if (res.status !== 200) {
    statusEl.textContent = `Failed to fetch comments: ${atob(res.body)}`;

    return;
  }
  createCommentForm.querySelector("textarea").value = "";
  statusEl.textContent = "";

  const { comments = [] } = JSON.parse(atob(res.body));
  // commentsList.innerHTML = comments
  //   .map(
  //     (comment) => `
  //     <li class="k3-comment bg-gray-800 py-2 px-4 my-4 rounded-md shadow-lg">
  //         <p class="k3-comment-author text-white font-bold">${
  //           comment.displayName
  //         } (${comment.name})</p>
  //         <p class="k3-comment-time text-gray-400 text-sm"><time>${new Date(
  //           comment.timestamp * 1000
  //         ).toLocaleString()}</time></p>
  //         <p class="k3-comment-content text-gray-300 mt-2">${
  //           comment.content
  //         }</p>
  //     </li>
  // `
  //   )
  //   .join("");
  commentsList.innerHTML = comments
    ?.sort((a, b) =>
      sortBy === "newest"
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp
    )
    .map(
      (comment) => `
      <article style="padding: 1rem; padding-left:1.5rem; padding-right:1.5rem; margin-bottom: 1.5rem; background-color: #1f2937; border-radius: 0.375rem; color: #ffffff">
  <footer style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
    <div style="display: flex; align-items: center;">
      <p style="display: inline-flex; align-items: center; margin-right: 0.75rem; font-weight: 600; font-size: 0.875rem; color: #ffffff;">
        <img
          style="margin-right: 0.5rem; width: 1.5rem; height: 1.5rem; border-radius: 9999px;"
          src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
          alt="Michael Gough"
        />
        ${comment.name}
      </p>
      <p style="font-size: 0.875rem; color: #718096;">
        <time dateTime="2022-02-08" title="February 8th, 2022">
          ${new Date(comment.timestamp * 1000).toLocaleString()}
        </time>
      </p>
    </div>

  </footer>
  <p>
    ${comment.content}
  </p>
</article>
  `
    )
    .join("");
};

updateForms();
await updateComments();

sort.addEventListener("change", async (e) => {
  e.preventDefault();
  await updateComments(sort.value);
});

signInButton.addEventListener("click", (e) => {
  e.preventDefault();
  signinForm.style.display = "flex";
  signupForm.style.display = "none";
  signInButton.style.borderColor = "#1e88e5";
  signInButton.style.color = "#1e88e5";
  signUpButton.style.borderColor = "transparent";
  signUpButton.style.color = "#757575";
});
signUpButton.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.style.display = "flex";
  signinForm.style.display = "none";
  signUpButton.style.borderColor = "#1e88e5";
  signUpButton.style.color = "#1e88e5";
  signInButton.style.borderColor = "transparent";
  signInButton.style.color = "#757575";
});
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("Signing up...");

  const displayName = signupForm.querySelector(".k3-name").value;
  const name = signupForm.querySelector(".k3-username").value;
  const password = signupForm.querySelector(".k3-password").value;

  statusEl.textContent = "Loading...";
  loader.style.visibility = "visible";

  const rawRes = await fetch(`${PERFORMER_URL}/execute/${CID}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      method: "POST",
      url: `/api/users`,
      body: btoa(
        JSON.stringify({
          name,
          displayName,
          password,
        })
      ),
      headers: {},
    }),
  });

  const res = await rawRes.json();
  if (res.status !== 200) {
    statusEl.textContent = `Couldn't sign you up: ${atob(res.body)}`;
    return;
  }

  statusEl.textContent = "";
  loader.style.visibility = "hidden";

  localStorage.setItem("k3-auth", btoa(`${name}:${password}`));
  updateForms();
});

signinForm.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("Signing in...");

  const name = signinForm.querySelector(".k3-username").value;
  const password = signinForm.querySelector(".k3-password").value;

  localStorage.setItem("k3-auth", btoa(`${name}:${password}`));
  updateForms();
});

createCommentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const auth = localStorage.getItem("k3-auth");
  if (!auth) {
    statusEl.textContent = "Must be signed in to post a comment";
    return;
  }

  statusEl.textContent = "Loading...";
  loader.style.visibility = "visible";

  const content = createCommentForm.querySelector("textarea").value;

  console.log("Creating comment...", content);
  const rawRes = await fetch(`${PERFORMER_URL}/execute/${CID}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      method: "POST",
      url: `/api/comments?url=${location}`,
      body: btoa(JSON.stringify({ content })),
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }),
  });

  const res = await rawRes.json();
  if (res.status !== 200) {
    statusEl.textContent = `Couldn't create comment: ${atob(res.body)}`;
    return;
  }
  console.log(res);

  statusEl.textContent = "";
  loader.style.visibility = "hidden";

  await updateComments();
});
