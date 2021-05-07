const util = require("util");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employees_db"
});

connection.connect();

// Setting up connection.query to use promises instead of callbacks to use the async/await syntax
connection.query = util.promisify(connection.query);

module.exports = connection;
