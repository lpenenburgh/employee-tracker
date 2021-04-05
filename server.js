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
                    viewEmployees();
                    break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "View All Roles":
                    viewRoles();
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

        console.log(`${res.affectedRows} New Employee added.`);
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


const updateEmployee = async () => {
    const employee = await connection.query("SELECT * FROM employee");
    const role = await connection.query("SELECT * FROM role");

    const data = await inquirer.prompt([{
            type: "list",
            name: "employeeToUpd",
            message: "Pick an Employee to update?",
            choices: employee.map(employee => ({
                name: employee.first_name + " " + employee.last_name,
                value: employee.id
            }))
        },
        {
            type: "rawlist",
            name: "newRole",
            message: "What is the Employee's role now?",
            choices: role.map(role => ({
                name: role.title,
                value: role.id
            }))
        }

    ])
    const res = await connection.query("UPDATE employee SET ? WHERE ?", [{
            role_id: data.newRole
        },
        {
            id: data.chosenEmployee
        }
    ])
    console.log(`\n${res.affectedRows} Employee has been updated.\n`);
    start();
};

const viewEmployees = async () => {
    try {
        const data = await connection.query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, role.salary, department.name as department_name,  CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY employee.last_name")
        console.table(data)
        start();
    } catch (err) {
        throw err;
    }
};

const viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        console.table(data)
        start();
    })
};

const viewRoles = () => {
    connection.query("SELECT role.id, role.title, role.salary, department.name as department_name FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY department_name", (err, data) => {
        if (err) throw err;
        console.table(data)
        start();
    })
};