const { Sequelize } = require("sequelize");
const { database } = require("./constants");
const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    port: database.port,
    dialect: "mysql",
    dialectOptions: {
        ssl: false
    },
  }
);

module.exports = sequelize;