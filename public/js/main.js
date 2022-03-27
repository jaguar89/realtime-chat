const socket = io();

const searchParams = new URLSearchParams(window.location.search);
// update chat room's name
document.querySelector("#room-name").textContent = searchParams.get("room");

// send user info when joining the chat
socket.emit("joinChat", {
  username: searchParams.get("username"),
  room: searchParams.get("room"),
});

// handle message event
socket.on("message", ({ username, message }) => {
  outputMessage(username, message);
});

// update ui with new users
socket.on("updateUI", ({ users }) => {
  const ul = document.querySelector("#users");
  ul.innerHTML = "";
  users.forEach((element) => {
    const li = document.createElement("li");
    li.innerHTML = `${element.username}`;
    ul.append(li);
  });
});

// handle disconnect
socket.on("disconnect", () => window.location.assign("index.html"));

// handle form submition
const form = document.forms[0];
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = form.msg.value;
  socket.emit("message", { text });
  form.msg.value = "";
  form.msg.focus();
});

// output message in chat area
function outputMessage(user, message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const meta = document.createElement("p");
  meta.classList.add("meta");
  meta.innerHTML = `${user} <span>${new Date().toLocaleTimeString([], {
    timeStyle: "short",
  })}</span>`;
  const text = document.createElement("p");
  text.classList.add("text");
  text.textContent = message;
  div.append(meta, text);
  document.querySelector(".chat-messages").append(div);
  div.scrollIntoView();
}
