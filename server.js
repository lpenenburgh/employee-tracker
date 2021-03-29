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
        name: "task",
        message: "What would you like to do?",
        choices: ["Add Employee", "Add a Department", "Add a Role", "Update Employee Roles", "View All Employees", "View All Departments", "View All Roles", "Exit"]
    })
        .then((answer) => {
            switch (answer.task) {
                case "Add Employee":
                    addAnEmployee();
                    break;
                case "Add a Department":
                    addADepartment();
                    break;
                case "Add a Role":
                    addARole();
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
                choices: roles.map(roles => ({
                    name: roles.title,
                    value: roles.id
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

        console.log(`\n${res.affectedRows} Department added.\n`);
        start();

    } catch (err) {
        throw err;
    }

};

const addARole = async () => {
    try {
        const department = await connection.query("SELECT * FROM departments");
    
    const data = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter the title of the roll you want to add."
        },
        {
            type: "input",
            name: "salary",
            message: "Enter the salary of the role using two decimal places"
        },
        {
            type: "rawlist",
            name: "depart_id",
            message: "Select which department the role belongs to",
            choices: departments.map(departments => ({
                name: departments.name,
                value: departments.id
            }))
        },
    ])
        const res = await connection.query("INSERT INTO roles SET ?", {
                title: data.title,
                salary: data.salary,
                departments_id: data.depart_id,
            });
            
                console.log(`\n${res.affectedRows} Role added.\n`);
                start();
    
} catch(err) {throw err};
};

