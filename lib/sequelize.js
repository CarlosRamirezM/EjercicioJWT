const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("moviesdb", "", "", {
  dialect: "sqlite",
  storage: "./database/database.sqlite",
});

sequelize.authenticate().then(() => {
  console.log("Authenticated!");
});

module.exports = sequelize;
