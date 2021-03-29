const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'employees_db',
});

const start = () => {
    inquirer.prompt({
        type: "list",
        name: "method",
        message: "What would you like to do?",
        choices: ["Add Employee", "Add a Department", "Add a Role", "Update Employee Roles", "View All Employees", "View All Departments", "View All Roles", "Exit"]
    })
        .then((answer) => {
            switch (answer.method) {
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Update Employee Roles":
                    updateEmployee();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                default:
                    connection.end();


            }
        });
};