const express = require("express");
const app = express();
const config = require("../config/server");
const userRoutes = require("./routes/user.routes");
const logger = require("./middlewares/logger");

app.use(express.json());
app.use(logger.logRequest);

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Node.js API!");
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

module.exports = app;
