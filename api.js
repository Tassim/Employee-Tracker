const mysql = require("mysql");
const cTable = require('console.table');
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'team_db',
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
      case 'View All Roles':
        viewAllRoles();
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
    let arrDept = department.map(dept => dept.departmentName);

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

// view all employees by manager
const viewAllEmplByManager = () => {
  const queryEmployee = 'SELECT * FROM employee';
  connection.query(queryEmployee, (err, employees) => {
    if (err) throw err;
    const arrEmployee = employees.map((employee) => {
      return {
        name: `${employee.firstName} ${employee.lastName}`,
        value: employee.id,
      };
    });
    console.log(arrEmployee);
    inquirer
      .prompt({
        name: 'manager',
        type: 'list',
        message: 'Select a manager:',
        choices: arrEmployee,
      }).then((answer) => {
        const query = `SELECT * FROM employee 
        LEFT JOIN roles ON roles.id = employee.roleId 
        LEFT JOIN department ON department.id = roles.departmentId WHERE employee.managerId = ?`;
        connection.query(query, answer.manager, (err, employee) => {
          if (err) throw err;
          if (employee.length > 0) {
            console.table('Employees by manager:', employee);
          } else {
            console.log('This employee does not manage any employees');
          }
          promptUser();
        });
      });
  });
};

// add an epmloyee
const addEmployee = () => {
  const queryRoles = 'SELECT * FROM roles';
  connection.query(queryRoles, (err, roles) => {
    if (err) throw err;
    const arrRoles = roles.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });

    const queryEmployee = 'SELECT * FROM employee;';
    connection.query(queryEmployee, (err, employees) => {
      if (err) throw err;
      const arrEmployee = employees.map((employee) => {
        return {
          name: `${employee.firstName} ${employee.lastName}`,
          value: employee.id,
        };
      });

      arrEmployee.unshift(
        {
          name: 'none',
          value: null,
        },
      );

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
            // console.table('New emoployee:', newEmployee);
            connection.query('SELECT * FROM employee WHERE id = ?', newEmployee.insertId, (err, newEmployeeId) => {
              console.table('New employee:', newEmployeeId);
              promptUser();
            });
            // promptUser();
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
        value: employee.id,
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
          const updateEmployeeRole = 'UPDATE employee SET roleId = ? WHERE employee.id = ?';
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

// view all roles
const viewAllRoles = () => {
  const queryRoles = 'SELECT id AS roleID, title, salary FROM roles';
  connection.query(queryRoles, (err, roles) => {
    if (err) throw err;
    console.table('All roles:', roles);
    promptUser();
  });
};
