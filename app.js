const mysql = require("mysql2");
const inquirer = require("inquirer");
const dotenv = require("dotenv");
const { getData, insertData, findspecificData } = require("./db/database");
const { capitalize } = require("./utils/utils");
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
        return getData(["*"], "department").then((result) => {
          return result;
        });
        break;
      case "View All roles":
        return getData(
          ["role.id", "title", "name as department", "salary"],
          `role INNER JOIN department ON department_id = department.id `
        ).then((result) => {
          return result;
        });
        break;
      case "View All Employees":
        return getData(
          ["employee.id", "first_name", "last_name", `title`, "salary", "name"],
          `employees_db.employee
          INNER JOIN employees_db.role ON role_id = role.id
          INNER JOIN employees_db.department ON department_id = department.id`
        );
      case "Add A Department":
        inquirer
          .prompt([
            {
              type: "input",
              name: "addDepartment",
              message: "What is the name of the deparment?",
            },
          ])
          .then((answers) => {
            answers.addDepartment = capitalize(answers.addDepartment);
            insertData("department", ["name"], [`'${answers.addDepartment}'`]);
            console.log(
              `Added ${answers.addDepartment} to Department database`
            );
          });

        break;
      case "Add A Role":
        inquirer
          .prompt([
            {
              type: "input",
              name: "roleName",
              message: "What is the name of the role?",
            },
            {
              type: "number",
              name: "salary",
              message: "What is the salary of the role?",
            },
            {
              type: "input",
              name: "roleDepartment",
              message: "Which department does the role belong to?",
            },
          ])
          .then(async (answers) => {
            let { id } = await findspecificData(
              'department',
              "id",
              "name",
              `'${answers.roleDepartment}'`
            );
            answers.roleName = capitalize(answers.roleName);
            answers.roleDepartment = capitalize(answers.roleDepartment);
            insertData(
              "role",
              ["title", "salary", "department_id"],
              [`'${answers.roleName}'`, answers.salary, id]
            );
            console.log(`Added ${answers.roleName} to ${answers.roleDepartment} database.`)
          });
        break;
      //case:
      // break;
    }
  });
