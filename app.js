const inquirer = require("inquirer");
const {
  getData,
  insertData,
  findSpecificData,
  updateData,
} = require("./db/database");
const { capitalize } = require("./utils/utils");

// function that starts inquirer prompt and re initializes after every string of questions are answered
function start() {
  return inquirer
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
            start();
          });
          break;
        case "View All roles":
          return getData(
            ["role.id", "title", "name as department", "salary"],
            `role INNER JOIN department ON department_id = department.id `
          ).then((result) => {
            // return result;
            start();
          });
          break;
        case "View All Employees":
          return getData(
            [
              "employee.id",
              "employee.first_name",
              "employee.last_name",
              "title",
              "department.name as department",
              "salary",
              "CONCAT(e.first_name, ' ', e.last_name) as manager",
            ],
            ` 
          employees_db.employee
          INNER JOIN employees_db.role ON role_id = role.id
          INNER JOIN employees_db.department ON department_id = department.id
		      LEFT OUTER JOIN employee as e ON e.id = employee.manager_id
          ORDER BY last_name
          `
          ).then(() => {
            start();
          });
        case "Add A Department":
          return inquirer
            .prompt([
              {
                type: "input",
                name: "addDepartment",
                message: "What is the name of the deparment?",
              },
            ])
            .then((answers) => {
              answers.addDepartment = capitalize(answers.addDepartment);
              insertData(
                "department",
                ["name"],
                [`'${answers.addDepartment}'`]
              );
              console.log(
                `Added ${answers.addDepartment} to Department database`
              );
              start();
            });

          break;
        case "Add A Role":
          return inquirer
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
                type: "list",
                name: "roleDepartment",
                message: "Which department does the role belong to?",
                choices: async () => {
                  let data = await findSpecificData(
                    "department",
                    "name",
                    "id",
                    ">",
                    "0"
                  ).then(async (data) => {
                    let arr = [];
                    await data.map((each) => {
                      arr.push(each.name);
                    });
                    return arr;
                  });
                  return data;
                },
              },
            ])
            .then(async (answers) => {
              let data = await findSpecificData(
                "department",
                "id",
                "name",
                "=",
                `'${answers.roleDepartment}'`
              );

              let { id } = data[0];
              answers.roleName = capitalize(answers.roleName);
              // answers.roleDepartment = capitalize(answers.roleDepartment);
              insertData(
                "role",
                ["title", "salary", "department_id"],
                [`'${answers.roleName}'`, answers.salary, id]
              );
              console.log(
                `Added ${answers.roleName} to ${answers.roleDepartment} database.`
              );
              start();
            });
          break;
        case "Add An Employee":
          return inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
              },
              {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
              },

              {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: async () => {
                  let data = await findSpecificData(
                    "employee",
                    "first_name, last_name",
                    "id",
                    ">",
                    `0`
                  ).then(async (data) => {
                    let arr = ["None"];
                    await data.map((each) => {
                      arr.push(
                        capitalize(each.first_name) +
                          " " +
                          capitalize(each.last_name)
                      );
                    });
                    return arr;
                  });
                  return data;
                },
              },
              {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: async () => {
                  let data = await findSpecificData(
                    "role",
                    "title",
                    "id",
                    ">",
                    `0`
                  ).then(async (data) => {
                    let arr = [];
                    await data.map((each) => {
                      arr.push(each.title);
                    });
                    return arr;
                  });
                  return data;
                },
              },
            ])
            .then(async (answers) => {
              let managerInfo = await findSpecificData(
                "employee",
                "id",
                "CONCAT(first_name, ' ', last_name)",
                "=",
                `"${answers.manager}"`
              );
              let roleInfo = await findSpecificData(
                "role",
                "id",
                "title",
                "=",
                `"${answers.role}"`
              );
              let managerId = managerInfo[0]?.id;
              const { id: roleId } = roleInfo[0];
              answers.firstName = capitalize(answers.firstName);
              answers.lastName = capitalize(answers.lastName);
              insertData(
                "employee",
                ["first_name", "last_name", "role_id", "manager_id"],
                [
                  `"${answers.firstName}"`,
                  `"${answers.lastName}"`,
                  roleId,
                  `${answers.manager == "None" ? null : managerId}`,
                ]
              );
              console.log(
                `Added ${answers.firstName} ${answers.lastName} to the ${answers.role} database.`
              );
              start();
            });
          break;
        case "Update An Employee Role":
          return inquirer
            .prompt([
              {
                type: "list",
                name: "employeeToUpdate",
                message: "Which employee's role do you want to update?",
                choices: async () => {
                  let data = await findSpecificData(
                    "employee",
                    "CONCAT(first_name, ' ', last_name) as name",
                    "id",
                    ">",
                    "0"
                  ).then(async (data) => {
                    let arr = [];
                    await data.map((each) => {
                      arr.push(each.name);
                    });
                    return arr;
                  });
                  return data;
                },
              },

              {
                type: "list",
                name: "changeRoleTo",
                message: "Which role do you want assign this employee to?",
                choices: async () => {
                  let data = await findSpecificData(
                    "role",
                    "title",
                    "id",
                    ">",
                    `0`
                  ).then(async (data) => {
                    let arr = [];
                    await data.map((each) => {
                      arr.push(each.title);
                    });
                    return arr;
                  });
                  return data;
                },
              },
            ])
            .then(async (answers) => {
              let roleInfo = await findSpecificData(
                "role",
                "id",
                "title",
                "=",
                `"${answers.changeRoleTo}"`
              );
              let employeeInfo = await findSpecificData(
                "employee",
                "id",
                "CONCAT(first_name,' ', last_name)",
                "=",
                `"${answers.employeeToUpdate}"`
              );
              let { id: roleId } = roleInfo[0];
              let { id: employeeId } = employeeInfo[0];
              updateData(
                "employee",
                `role_id = ${roleId}`,
                `CONCAT(first_name, ' ', last_name)`,
                "=",
                `"${answers.employeeToUpdate}"`
              );
              console.log(
                `Updated ${answers.employeeToUpdate}'s role to ${answers.changeRoleTo}`
              );
              start();
            });

          break;
      
      }
    });
}

start();
