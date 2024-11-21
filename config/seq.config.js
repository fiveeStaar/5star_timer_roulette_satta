const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "admin_5starxxxhkut",
  "5starxxxhkut",
  "4p_vzU913",
  {
    dialect: "mysql",
    host: "103.180.163.173",
    logging: false,
  }
);
module.exports = sequelize;
