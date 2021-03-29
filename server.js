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
                    addAnEmployee();
                    break;
                case "Add a Department":
                    addADepartment();
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

const addAnEmployee = async () => {
    try {
        const roles = await connection.query("SELECT * FROM roles")
        const manager = await connection.query("SELECT * FROM employees manager")

        const data = await inquirer.prompt([{
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "rawlist",
                name: "role_id",
                message: "What is the Employee's role?",
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            },
            {
                type: "rawlist",
                name: "manager_id",
                message: "Enter the Employee's Manager.",
                choices: manager.map(manager => ({
                    name: manager.first_name + " " + manager.last_name,
                    value: manager.id
                }))
            },
        ])

        const res = await connection.query("INSERT INTO employees SET ?", data)

        console.log(`${res.affectedRows} Employee has been added.`);
        start();
    } catch (err) {
        throw err
    }

};

const addADepartment = async () => {
    try {
        const data = await inquirer.prompt([{
            type: "input",
            name: "name",
            message: "Enter the department name you would like to add."
        }]);
        const res = await connection.query("INSERT INTO departments SET ?", {

            name: data.name,
        })

        console.log(`\n${res.affectedRows} Department added to table.\n`);
        start();

    } catch (err) {
        throw err;
    }

};
