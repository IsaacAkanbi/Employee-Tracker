const mysql = require ('mysql');
const inquirer = require('inquirer');
// const { allowedNodeEnvironmentFlags } = require('node:process');
require('console.table');


// Sets up our Connection to the MySQL DB
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Blyth234!",
    database: "employee_db"
});

connection.connect();


// Inialization Function
function start() {
    inquirer.prompt(
        {
            type: "list",
            name: "options",
            message: "What would you like to do?",
            choices: ["View Departments", "View Roles", "View Employees", "Add Department", "Add Roles", "Add Employees", "Update Employee Role", "Update Employee Manager"]
        }
    ).then(answer => {
        console.log(answer);

        switch(answer.options) {
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees":
                viewEmployees();
                break;
            case "Add Department":
                addDepartment();
               break;
            case "Add Roles":
                addRoles();    
                break;
            case "Add Employees":
                addEmployee();
                break;
        }
    })
}

start();

function viewDepartments() {

    // Requesting data from our DB
    connection.query("SELECT * FROM employee_db.department", function(error, res) {
        if(error) {
            console.log(error);
        }

        console.log(res);
        console.table(res);
        start();
    })
};

function viewRoles() {
    connection.query("SELECT * FROM role", function(error, res) {
        if(error) {
            console.log(error);
        }

        console.table(res);
        start();
    })
};

function viewEmployees() {
    connection.query("SELECT * FROM employee", function(error, res) {
        if(error) {
            console.log(error);
        }

        console.table(res);
        start();
    })
};

function addDepartment() {

    inquirer.prompt([
        {
            type: 'input',
            name: "departmentName",
            message: "What department do you want to add?"
        },
    ]).then(answer => {

        // Requesting data from our DB
    connection.query("INSERT INTO department SET ?", {name: answer.departmentName} , function(error, res) {
        if(error) {
            console.log(error);
        }

        console.table(res);
        start();
    })
    })
}

function addRoles() {

    inquirer.prompt([
        {
            type: 'input',
            name: "departmentName",
            message: "What department do you want to add?"
        },
        {

        }
    ]).then(answer => {

        // Requesting data from our DB
    connection.query("INSERT INTO department SET ?", {name: answer.input} , function(error, res) {
        if(error) {
            console.log(error);
        }

        console.table(res);
        start();
    })
    })
}