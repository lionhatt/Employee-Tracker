const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { async } = require("rxjs");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    init();
});

function getDepartments() {
    return new Promise((resolve, reject) => {
        connection.query("select * from department", function (err, res) {
            if (err) reject(err);
            connection.end;
            resolve(res);
        })
    })
}

function getRole() {
    return new Promise((resolve, reject) => {
        connection.query("select * from role", function (err, res) {
            if (err) reject(err);
            connection.end;
            resolve(res);
        })
    })
}

function getEmployee() {
    return new Promise((resolve, reject) => {
        connection.query("select * from employee", function (err, res) {
            if (err) reject(err);
            connection.end;
            resolve(res);
        })
    })
}

function init() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add departments, roles, employees",
                "View departments, roles, employees",
                "Update employee roles",
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add departments, roles, employees":
                    addTable();
                    break;

                case "View departments, roles, employees":
                    viewTable();
                    break;

                case "Update employee roles":
                    updateRole();
                    break;
            }
        })
}

function addTable() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Which table would you like to add to?",
            choices: [
                "Add departments",
                "Add roles",
                "Add employees",
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add departments":
                    addDepartment();
                    break;

                case "Add roles":
                    addRole();
                    break;

                case "Add employees":
                    addEmployee();
                    break;
            }
        })
}

function addDepartment() {
    inquirer.prompt({
        name: "name",
        type: "input",
        message: "Input the name of the new department"
    }).then(function (answer) {
        connection.query("insert into department(name) value (?)", answer.name, function (err, res) {
            if (err) throw err;
            connection.end;
            console.log(res.affectedRows + " department inserted!");
            init();
        })
    })
}

async function addRole() {
    try {
        let departments = await getDepartments();
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Input the title of new row"
            },
            {
                name: "salary",
                type: "input",
                message: "Input the salary for this role"
            },
            {
                name: "department",
                type: "list",
                message: "Select the department for this role",
                choices: departments.map(value => `${value.id}: ${value.name}`)
            }
        ])
            .then(function (answer) {
                let id = answer.department.split(": ")[0];
                connection.query("insert into role(title, salary, department_id) values (?, ?, ?)",
                    [
                        answer.title,
                        answer.salary,
                        id
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " role inserted!")
                        init();
                    })
            })

    } catch (err) {
        console.log(err);
    }

}

async function addEmployee() {
    try {
        let roles = await getRole();
        let managers = await getEmployee();
        let managersList = managers.map(value => `${value.id}: ${value.first_name} ${value.last_name}`);
        managersList.push("None")

        inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                default: null,
                message: "Input employee first name"
            },
            {
                name: "last_name",
                type: "input",
                default: null,
                message: "Input employee last name"
            },
            {
                name: "role",
                type: "list",
                message: "Choose employee's role",
                choices: roles.map(value => `${value.id}: ${value.title}`)
            },
            {
                name: "manager",
                type: "list",
                message: "Choose employee's manager",
                choices: managersList
            }
        ]).then(function (answer) {
            let role_id = answer.role.split(": ")[0];
            if (answer.manager === "None") {
                connection.query("insert into employee(first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)",
                    [
                        answer.first_name,
                        answer.last_name,
                        role_id,
                        null
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " employee inserted!");
                        init();
                    })
            } else if (answer.manager !== "None") {
                let manager_id = answer.manager.split(": ")[0];
                connection.query("insert into employee(first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)",
                    [
                        answer.first_name,
                        answer.last_name,
                        role_id,
                        manager_id
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " employee inserted!");
                        init();
                    })
            }
        })
    } catch (err) {
        console.log(err);
    }
}

function viewTable() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Which table would you like to view?",
            choices: [
                "View departments",
                "View roles",
                "View employees",
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View departments":
                    viewDepartment();
                    break;

                case "View roles":
                    viewRole();
                    break;

                case "View employees":
                    viewEmployee();
                    break;
            }
        })
}

async function viewDepartment() {
    try {
        let departments = await getDepartments();
        let table = cTable.getTable(departments);
        console.log(table);
        init();
    } catch (err) {
        console.log(err);
    }
}

async function viewRole() {
    try {
        let roles = await getRole();
        let table = cTable.getTable(roles);
        console.log(table);
        init();
    } catch (err) {
        console.log(err);
    }
}

async function viewEmployee() {
    try {
        let employees = await getEmployee();
        let table = cTable.getTable(employees);
        console.log(table);
        init();
    } catch (err) {
        console.log(err);
    }
}

async function updateRole() {
    try {
        let employees = await getEmployee();
        let roles = await getRole();
        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Choose an employee to update role",
                choices: employees.map(value => `${value.id}: ${value.first_name} ${value.last_name}`)
            },
            {
                name: "role",
                type: "list",
                message: "Choose a new role",
                choices: roles.map(value =>  `${value.id}: ${value.title}`)
            }
        ]).then(function (answer) {
            let role_id = answer.role.split(": ")[0];
            let id = answer.employee.split(": ")[0];
            connection.query("update employee set ? where ?",
                [
                    {
                        role_id: role_id
                    },
                    {
                        id: id
                    }
                ], function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + "employee");
                    init();
                }
            )
        })
    } catch (err) {
        console.log(err);
    }
}


