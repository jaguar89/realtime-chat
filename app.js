const express = require("express");
const socketIO = require("socket.io");
const {
  createUser,
  getUser,
  getRoomUsers,
  deleteUser,
} = require("./utils/users");
const { formatMessage } = require("./utils/messages");
require("dotenv").config();

// create our app
const app = express();

// serve static files
app.use(express.static("public"));

// start listening on port
const server = app.listen(process.env.PORT, () =>
  console.log(`server is running on ${process.env.PORT}`)
);

// set up socket
const io = socketIO(server);

// handle socket connection event
io.on("connection", (socket) => {
  // handle new user joining the chat
  socket.on("joinChat", ({ username, room }) => {
    const user = createUser(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessage("ChatBot", "welcome to ChatCord."));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("ChatBot", `${user.username} has joined the room.`)
      );
    io.to(user.room).emit("updateUI", {
      users: getRoomUsers(user.room),
    });
  });

  // handle new chat message
  socket.on("message", ({ text }) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, text));
  });

  // handle socket disconnection
  socket.on("disconnect", () => {
    const user = deleteUser(socket.id);
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("ChatBot", `${user.username} has left the room.`)
      );
    socket.broadcast.to(user.room).emit("updateUI", {
      users: getRoomUsers(user.room),
    });
  });
});
