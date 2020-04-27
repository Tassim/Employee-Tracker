const mysql = require("mysql");
const cTable = require('console.table');
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'team_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

const promptUser = () => {
  inquirer.prompt({
    type: 'list',
    name: 'firstChoices',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'View All Employees By Department',
      'View All Employees By Manager',
      'Add Employee',
      'Remove Employee',
      'Update Employee Role',
      'Update Employee NavigationPreloadManager',
      'View All Roles',
    ],
  }).then(answer => {
    switch (answer.firstChoices) {
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'View All Employees By Department':
        viewAllEmplByDept();
        break;
      case 'View All Employees By Manager':
        viewAllEmplByManager();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Remove Employee':
        removeEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRoles();
        break;
    }
  });
};
promptUser();

// view all employees
const viewAllEmployees = () => {
  const query = `SELECT employee.id AS employeeId, firstName, lastName, title, salary, departmentName 
  FROM employee 
  LEFT JOIN roles 
  ON employee.roleId = roles.id 
  LEFT JOIN department 
  ON roles.departmentId = department.id;`;
  connection.query(query, (err, employee) => {
    if (err) throw err;
    console.table('All employee:', employee);
    promptUser();
  });
};

// view all employees by department
const viewAllEmplByDept = () => {
  const queryDept = 'SELECT * FROM department';
  connection.query(queryDept, (err, department) => {
    if (err) throw err;
    // console.log(department);
    let arrDept = department.map(dept => dept.departmentName);
    // console.log(arrDept);

    inquirer.prompt({
      name: 'department',
      type: 'list',
      message: 'Select a department:',
      choices: arrDept,
    }).then((answer) => {
      const query = `SELECT employee.id AS employeeId, firstName, lastName, title, salary, departmentName FROM employee LEFT JOIN roles ON employee.roleId = roles.id LEFT JOIN department ON roles.departmentId = department.id
      WHERE department.departmentName = ?;`;
      connection.query(query, answer.department, (err, employee) => {
        if (err) throw err;
        if (employee.length > 0) {
          console.table('Employee by department:', employee);
        } else {
          console.log('No employees found in this department');
        }
        promptUser();
      });
    });
  });
};

// // view all employees by manager
// const viewAllEmplByManager = () => {
//   const queryEmployee = 'SELECT * FROM employee';
//   connection.query(queryEmployee, (err, employees) => {
//     if (err) throw err;
//     const arrEmployee = employees.map((employee) => {
//       // to add an if statement to bring only the employee of the department based on the roles choice
//       return {
//         name: `${employee.firstName} ${employee.lastName}`,
//         value: employee.id,
//       };
//     });
//     console.log(arrEmployee)
//     inquirer
//       .prompt({
//         name: 'manager',
//         type: 'list',
//         message: 'Select an employee:',
//         choices: arrEmployee,
//       }).then((answer) => {
//         const query = `SELECT * FROM employee 
//         LEFT JOIN employee.id = managerId
//         WHERE ?;`;
//         connection.query(query, answer, (err, employee) => {
//           if (err) throw err;
//           if (employee.length > 0) {
//             console.table('Employee by department:', employee);
//           } else {
//             console.log('No employees found in this department');
//           }
//           promptUser();
//         });
//       });
//   });
// };

// add an epmloyee
const addEmployee = () => {
  const queryRoles = 'SELECT * FROM roles';
  connection.query(queryRoles, (err, roles) => {
    if (err) throw err;
    console.log(roles);
    const arrRoles = roles.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    console.log(arrRoles);

    const queryEmployee = 'SELECT * FROM employee;';
    connection.query(queryEmployee, (err, employees) => {
      if (err) throw err;
      console.log('all employees:', employees);
      const arrEmployee = employees.map((employee) => {
        // to add an if statement to bring only the employee of the department based on the roles choice
        return {
          name: `${employee.firstName} ${employee.lastName}`,
          value: employee.id,
        };
      });
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'firstName',
            message: "What's the employee first Name?",
          },
          {
            type: 'input',
            name: 'lastName',
            message: "What's the employee last Name?",
          },
          {
            type: 'list',
            name: 'roleId',
            message: "What's employee role?",
            choices: arrRoles,
          },
          {
            type: 'list',
            name: 'managerId',
            message: "Who's the employee manager?",
            choices: arrEmployee,
          },
        ]).then((response) => {
          console.log(response);
          const queryAddEmployee = 'INSERT INTO employee SET ?';
          connection.query(queryAddEmployee, response, (err, newEmployee) => {
            if (err) throw err;
            console.table('New emoployee:', newEmployee);
            promptUser();
          });
        });
    });
  });
};

const removeEmployee = () => {
  const queryEmployee = 'SELECT * FROM employee;';
  connection.query(queryEmployee, (err, employees) => {
    if (err) throw err;
    // console.log('all employees:', employees);
    const arrEmployee = employees.map((employee) => {
    // to add an if statement to bring only the employee of the department based on the roles choice
      return {
        name: `${employee.firstName} ${employee.lastName}`,
        value: employee.id,
      };
    });

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'removeEmployee',
          message: 'Which employee do you want to remove?',
          choices: arrEmployee,
        },
      ]).then((response) => {
        console.log('Hello', response);
        const deleteEmployee = 'DELETE FROM employee WHERE id = ?;';
        connection.query(deleteEmployee, response.removeEmployee, (err, delEmployee) => {
          if (err) throw err;
          console.log('deleted:', delEmployee);
          promptUser();
        });
      });
  });
};

const updateEmployeeRoles = () => {
  const queryEmployee = 'SELECT * FROM employee;';
  connection.query(queryEmployee, (err, employees) => {
    if (err) throw err;
    console.log('all employees:', employees);
    const arrEmployee = employees.map((employee) => {
    // to add an if statement to bring only the employee of the department based on the roles choice
      return {
        name: `${employee.firstName} ${employee.lastName}`,
        value: employee.roleId,
      };
    });
    const queryRoles = 'SELECT * FROM roles';
    connection.query(queryRoles, (err, roles) => {
      if (err) throw err;
      // console.log(roles);
      const arrRoles = roles.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'selectEmployee',
            message: 'Please select an employee',
            choices: arrEmployee,
          },
          {
            type: 'list',
            name: 'selectRole',
            message: "Select the employee's new role",
            choices: arrRoles,
          },
        ]).then((response) => {
          console.log(response.selectEmployee);
          const updateEmployeeRole = 'UPDATE employee SET roleId = ? WHERE ?';
          connection.query(updateEmployeeRole, [response.selectRole, response.selectEmployee], (err, newEmployee) => {
            if (err) throw err;
            // console.log(newEmployee);
            console.table('New emoployee:', newEmployee);
            promptUser();
          });
        });
    });
  });
};
