const users = [];

function createUser(id, username, room) {
  const user = {
    id,
    username,
    room,
  };
  users.push(user);
  return user;
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

function deleteUser(id) {
  const index = users.findIndex((user) => user.id === id);
  return users.splice(index, 1)[0];
}

module.exports = {
  createUser,
  getUser,
  getRoomUsers,
  deleteUser,
};
