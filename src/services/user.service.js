let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

exports.getAllUsers = () => {
  return users;
};

exports.getUserById = (id) => {
  return users.find((user) => user.id === id);
};

exports.createUser = (data) => {
  const newUser = { id: users.length + 1, ...data };
  users.push(newUser);
  return newUser;
};

exports.updateUser = (id, data) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return null;
  users[userIndex] = { ...users[userIndex], ...data };
  return users[userIndex];
};

exports.deleteUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return null;
  const deletedUser = users.splice(userIndex, 1);
  return deletedUser[0];
};
