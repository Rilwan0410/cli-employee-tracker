const mysql = require("mysql2");
const inquirer = require("inquirer");
const dotenv = require("dotenv");
const { getDepartments } = require("./db/database");
dotenv.config();

const database = mysql.createConnection(
  {
    host: process.env.HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.DATABASE,
  },
  console.log("connected to db")
);

inquirer
  .prompt([
    {
      type: "list",
      name: "option",
      message: "What Would You Like To Do?",
      choices: [
        "View All Departments",
        "View All roles",
        "View All Employees",
        "Add A Department",
        "Add A Role",
        "Add An Employee",
        "Update An Employee Role",
      ],
    },
  ])
  .then((answers) => {
    const { option } = answers;
    switch (option) {
        case "View All Departments":
            return getDepartments().then((result) => {
                return result
        });
        break;
    }
  });
