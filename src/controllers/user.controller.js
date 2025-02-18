const userService = require("../services/user.service");

exports.getAllUsers = (req, res) => {
  res.status(200).json(userService.getAllUsers());
};

exports.getUserById = (req, res) => {
  const user = userService.getUserById(parseInt(req.params.id, 10));
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

exports.createUser = (req, res) => {
  const newUser = userService.createUser(req.body);
  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const updatedUser = userService.updateUser(
    parseInt(req.params.id, 10),
    req.body
  );
  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

exports.deleteUser = (req, res) => {
  const deletedUser = userService.deleteUser(parseInt(req.params.id, 10));
  if (deletedUser) {
    res.status(200).json({ message: "User deleted" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
