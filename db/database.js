const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const dotenv = require("dotenv");
const createTable = require("../utils/utils");
dotenv.config();

async function getDepartments() {
  try {
    const db = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: process.env.MYSQL_PORT,
      database: process.env.DATABASE,
    });
    let [data] = await db.execute(`SELECT * FROM department;`);
    createTable(data);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getDepartments,
};
