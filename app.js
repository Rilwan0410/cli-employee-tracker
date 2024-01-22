const mysql = require("mysql2");
const dotenv = require("dotenv");
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

