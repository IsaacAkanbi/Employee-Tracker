const mysql = require("mysql");
const inquirer = require("inquirer");
// const { allowedNodeEnvironmentFlags } = require('node:process');
require("console.table");
//const start = require('start');

// Sets up our Connection to the MySQL DB
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Blyth234!",
  database: "employee_db",
});

connection.connect();

// Inialization Function
function start() {
  inquirer
    .prompt({
      type: "list",
      name: "options",
      message: "What would you like to do?",
      choices: [
        "View Departments",
        "View Roles",
        "View Employees",
        "Add Department",
        "Add Roles",
        "Add Employees",
        "Update Employee Role",
        "Update Employee Manager",
        "View Employees by Manager",
      ],
    })
    .then((answer) => {
      console.log(answer);

      switch (answer.options) {
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
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        case "View Employees by Manager":
          viewEmployeesByManager();
          break;
      }
    });
}

start();

let employeesArr = [];
function getEmployees() {
  return connection.query("SELECT * FROM employee", function (error, result) {
    if (error) {
      console.log(error);
    }
    result.forEach((employee) => {
        employeesArr.push({
        name: employee.first_name,
        value: employee.id 
      });
    });
  });
}
getEmployees();

let rolesArr = [];
function getRoles() {
  return connection.query("SELECT * FROM role", function (error, result) {
    if (error) {
      console.log(error);
    }
    result.forEach((role) => {
      rolesArr.push({
        name: role.title,
        value: role.id
      });
    });
  });
}
// it's invoked at the start, doesn't need to be invoked again.
getRoles();


function viewDepartments() {
  // Requesting data from our DB
  connection.query(
    "SELECT * FROM employee_db.department",
    function (error, res) {
      if (error) {
        console.log(error);
      }

      console.log(res);
      console.table(res);
      start();
    }
  );
}

function viewRoles() {
  connection.query("SELECT * FROM role", function (error, res) {
    if (error) {
      console.log(error);
    }

    console.table(res);
    start();
  });
}

function viewEmployees() {
  connection.query("SELECT * FROM employee", function (error, res) {
    if (error) {
      console.log(error);
    }

    console.table(res);
    start();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What department do you want to add?",
      },
    ])
    .then((answer) => {
      // Requesting data from our DB
      connection.query(
        "INSERT INTO department SET ?",
        { name: answer.departmentName },
        function (error, res) {
          if (error) {
            console.log(error);
          }

          console.table(res);
          start();
        }
      );
    });
}

function addRoles() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What title do you want to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
      },
      {
        type: "input",
        name: "department_id",
        message: "What is the department ID?",
      },
    ])
    .then((answer) => {
      // Requesting data from our DB
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        function (error, res) {
          if (error) {
            console.log(error);
          }

          console.table(res);
          start();
        }
      );
    });
}



function addEmployee() {
  if (rolesArr.length > 0) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "Enter the first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "Enter the last name?",
        },
        {
          type: "list",
          name: "role_id",
          message: "What is their role",
          choices: rolesArr,
        },
        {
          type: "input",
          name: "manager_id",
          message: "What is the manager's ID?",
        },
      ])
      .then((answer) => {
        // Requesting data from our DB
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.role_id,
            manager_id: answer.manager_id,
          },
          function (error, res) {
            if (error) {
              console.log(error);
            }

            console.table(res);
            start();
          }
        );
      });
  }
}

// function to get list of roles and push them into an array for inquirer
// use rolesArr in multiple places to show/select a role


const updateEmployeeRole = () =>{
  console.log('Updating employee role ...\n');
  console.log(employeesArr);
  inquirer.prompt([
    {
      name: 'employee',
      type: 'list',
      message: 'What employee do you want to update?',
     choices: employeesArr 
    },
    {
      name: 'role',
      type: 'list',
      message: 'What role do you want to update?',
      choices: rolesArr
    }
  ]) .then((res) => {
    console.log(res.employee)
    console.log(res.role); 
    connection.query('UPDATE employee SET employee.role_id = ? WHERE employee.id = ?',
    [
      res.role,

      res.employee
    ],
    
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} role inserted!\n`);
      console.table(res);
      start();
    }   
  );
  })}


//function updateEmployeeRole() {
  
 // return connection.querry("SELECT * FROM employee", function (error, result) {

 // })
  // need to get a list of employees from our db
  // we need to push (or put) that list into an array to show as a list of choices in our inquirer
  // that list needs to be formatted so that the name is visible but the value is the employee's id
  // example:
  // {
  //name: emp_name,
  //value: id
  // }
 // inquirer.prompt([{

//  }]);
//}



