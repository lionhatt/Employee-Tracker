var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "elaine0803",
    database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    promptUser();
});

function promptUser() {
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
    .then(function(answer){
        switch (answer.action) {
            case "Add departments, roles, employees":
                addTable();
                break;
            
            case "View departments, roles, employees":
                viewTable();
                break;
            
            case "Update employee roles":
                updateTable();
                break;
        }
    })
}