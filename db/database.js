const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const dotenv = require("dotenv");
const { createTable } = require("../utils/utils");
dotenv.config();

async function getData(filter, query) {
  try {
    const db = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: process.env.MYSQL_PORT,
      database: process.env.DATABASE,
    });
    let [data] = await db.query(`SELECT ${filter.join(",")} FROM ${query}`);
    if (data.length > 0) {
      return createTable(data);
    } else {
      console.log("No Data Available.");
    }
  } catch (err) {
    console.log(err);
  }
}

async function insertData(tableName, filter, values) {
  try {
    const db = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: process.env.MYSQL_PORT,
      database: process.env.DATABASE,
    });

    let [data] = await db.query(
      `INSERT INTO ${tableName} (${filter.join(", ")}) VALUES(${values.join(
        ", "
      )});
      `
    );
  } catch (err) {
    console.log(err);
  }
}

// async function createData(){

// }

module.exports = {
  getData,
  insertData,
};
