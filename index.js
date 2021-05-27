const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const { restoreDefaultPrompts } = require("inquirer");
require("console.table");

// Sets up our Connection to the MySQL DB
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Blyth234!",
  database: "employee_db",
});

// Inialization Function
connection.connect((err) => {
  if (err) throw err;
  start();
});

const start = () => {
  inquirer
    .prompt({
      type: 'list',
      name: 'options',
      message: "What would you like to do?",
      choices: [
        '1) View Departments',
        '2) View Roles',
        '3) View Employees',
        '4) Add Department',
        '5) Add Roles',
        '6) Add Employees',
        '7) Update Employee Role',
        '8) Update Employee Manager',
      ],
    })
    .then((answer) => {
      console.log(answer);
      switch (answer.options) {
        case '1) View Departments':
              viewDepartments();
              break;

        case '2) View Roles':
            viewRoles();
             break;

        case '3) View Employees':
              viewEmployees();
          break;

        case '4) Add Department':
          addDepartment();
          break;

        case '5) Add Roles':
              addRoles();
          break;

        case '6) Add Employees':
            addEmployee();
            break;

        case '7) Update Employee Role':
            updateEmployeeRole();
            break;
        
        case '8) Update Employee Manager':
          updateEmployeeManager();
          break;
        
        default:
          console.log(`Invalid action: ${answer.options}`);
          break;
      }
    });
};

async function getEmployees() {
  connection.query("SELECT * FROM employee", (err, res) => {
      if(err) {
        console.log(err);
        throw err;
      }
          // console.table(res)
      let data = res.map(employee => {
        return {
          name: employee.first_name,
          value: employee.id
        }
      });

      console.log("Employee Data...")
      console.log(data);
      return data;
  });
}

async function getRoles() {
  connection.query("SELECT * FROM role", function (error, res) {
    if (error) {
      console.log(error);
    }

    // Data Formatting
    let data = res.map(role => {
      return {
        name: role.title,
        value: role.id
      }
    })
    // Return Data from DB
    return data;
  });
}

const viewDepartments = () => {
  connection.query(
    "SELECT * FROM employee_db.department",
    function (error, res) {
      if (error) {
        console.log(error);
      }
      //console.log(res);
      console.table(res);
      start();
    });
    

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

async function addEmployee() {

  connection.query("SELECT * FROM role", function (error, res) {
    if (error) {
      console.log(error);
    }

    // Data Formatting
    let rolesArr = res.map(role => {
      return {
        name: role.title,
        value: role.id
      }
    })

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
    });
  }
    
const updateEmployeeRole = async () => {
  // Query DB for Role info
  connection.query("SELECT * FROM role", function (error, res) {
    if (error) {
      console.log(error);
    }

    // Data Formatting
    let dataRoles = res.map(role => {
      return {
        name: role.title,
        value: role.id
      }
    })

    // Make Another DB query for Employees
    connection.query("SELECT * FROM employee", (err, res) => {
      if(err) {
        console.log(err);
        throw err;
      }
          // console.table(res)
      let dataEmployees = res.map(employee => {
        return {
          name: employee.first_name,
          value: employee.id
        }
      });
      // Query User for More info
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "What employee do you want to update?",
            choices: dataEmployees
          },
          {
            name: "role",
            type: "list",
            message: "What role do you want to update?",
            choices: dataRoles
          },
        ])
        .then((res) => {
          console.log(res.employee);
          console.log(res.role);
          connection.query(
            "UPDATE employee SET employee.role_id = ? WHERE employee.id = ?",
            [res.role, res.employee], (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} role inserted!\n`);
              console.table(res);
              start();
            }
          );
        })
        .catch(err => {
          console.log(err)
        }); // End of Inquirer method

    });  // end of Employee Query

  });  // end of Role Query

}

function updateEmployeeManager() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if(err) {
      console.log(err);
      throw err;
    }
        // console.table(res)
    let dataEmployees = res.map(employee => {
      return {
        name: employee.first_name,
        value: employee.id
      }
    });
    let dataManager = res.map(employee => {
      return {
      name: employee.manager_id,
          value: employee.manager_id
        }
    });

    //console.log(dataEmployees);
    // Query User for More info
    inquirer
      .prompt([
        {
          name: "employeeId",
          type: "list",
          message: "What is the name of the employee you want to update?",
          choices: dataEmployees
        },
        {
          name: "managerId",
          type: "list",
          message: "What manager ID do you want to update to?",
          choices: dataManager
        },
      ])
      .then((res) => {
       
        connection.query(
          "UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?",
          [res.managerId, res.employeeId], (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} role inserted!\n`);
            console.table(res);
            start();
          }
        );
        
      })
      .catch(err => {
        console.log(err)
      }); // End of Inquirer method

  });  // end of Employee Query
}
