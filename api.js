const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const employeeQueries = require('./models/employees/employeeQueries');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'team_db',
}).promise();

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

const promptUser = async () => {
  const answer = await inquirer.prompt({
    type: 'list',
    name: 'firstChoices',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'View All Employees By Department',
      'View All Employees By Manager',
      'Add Employee',
      'Add Role',
      'Remove Employee',
      'Update Employee Role',
      'View All Roles',
      'View Department Utilized Budget',
    ],
  });
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
    case 'Add Role':
      addRole();
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
    case 'View Department Utilized Budget':
      viewDeptBudget();
      break;
    default:
      connection.end();
  }
};

promptUser();

// view all employees
const viewAllEmployees = async () => {
  const [employee] = await connection.query(employeeQueries.viewAllEmployees);
  try {
    console.table('All employee:', employee);
  } catch (error) {
    console.log(e);
  }
  promptUser();
};

// view all employees by department
const viewAllEmplByDept = async () => {
  const [department] = await connection.query(employeeQueries.viewAllDept);
  const arrDept = department.map(dept => dept.departmentName);
  const answer = await inquirer.prompt({
    name: 'department',
    type: 'list',
    message: 'Select a department:',
    choices: arrDept,
  });
  const [employee] = await connection.query(employeeQueries.viewAllemplbyDept, answer.department);

  if (employee.length > 0) {
    console.table('Employee by department:', employee);
  } else {
    console.log('No employees found in this department');
  }
  promptUser();
};

// view all employees by manager
const viewAllEmplByManager = async () => {
  const [employees] = await connection.query(employeeQueries.viewAllEmpl);
  const arrEmployee = employees.map((employee) => {
    return {
      name: `${employee.firstName} ${employee.lastName}`,
      value: employee.id,
    };
  });
  console.log(arrEmployee);
  const answer = await inquirer
    .prompt({
      name: 'manager',
      type: 'list',
      message: 'Select a manager:',
      choices: arrEmployee,
    });
  const [employee] = await connection.query(employeeQueries.viewAllEmplByManager, answer.manager);
  if (employee.length > 0) {
    console.table('Employees by manager:', employee);
  } else {
    console.log('This employee does not manage any employees');
  }
  promptUser();
};

// add an epmloyee
const addEmployee = async () => {
  const [roles] = await connection.query(employeeQueries.viewAllRoles);
  const arrRoles = roles.map((role) => {
    return {
      name: role.title,
      value: role.id,
    };
  });
  const [employees] = await connection.query(employeeQueries.viewAllEmpl);
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
  let response = await inquirer
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
    ]);
  console.log(response);
  const [newEmployee] = await connection.query(employeeQueries.addEmployee, response);
  const [newEmployeeId] = await connection.query(employeeQueries.viewEmplById, newEmployee.insertId);
  console.table('New employee:', newEmployeeId);
  promptUser();
};

// add a new role
const addRole = async () => {
  const [depts] = await connection.query(employeeQueries.viewAllDept);
  const arrDept = depts.map((dept) => {
    return {
      name: dept.departmentName,
      value: dept.id,
    };
  });
  let response = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Please add a role title?',
      },
      {
        type: 'input',
        name: 'salary',
        message: "What's the base salary for this role?",
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select a department',
        choices: arrDept,
      },
    ]);
  console.log(response);
  const [newRole] = await connection.query(employeeQueries.addRole, response);
  console.table('New role:', newRole);
  promptUser();
};

const removeEmployee = async () => {
  const [employees] = await connection.query(employeeQueries.viewAllEmpl);
  const arrEmployee = employees.map((employee) => {
    return {
      name: `${employee.firstName} ${employee.lastName}`,
      value: employee.id,
    };
  });
  const response = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'removeEmployee',
        message: 'Which employee do you want to remove?',
        choices: arrEmployee,
      },
    ]);
  console.log('Hello', response);
  const [delEmployee] = await connection.query(employeeQueries.deleteEmployee, response.removeEmployee);
  try {
    console.log('deleted:', delEmployee);
  } catch (error) {
    console.log(e);
  }
  promptUser();
};

const updateEmployeeRoles = async () => {
  const [employees] = await connection.query(employeeQueries.viewAllEmpl);
  console.log('all employees:', employees);
  const arrEmployee = employees.map((employee) => {
    return {
      name: `${employee.firstName} ${employee.lastName}`,
      value: employee.id,
    };
  });
  const [roles] = await connection.query(employeeQueries.viewAllRoles);
  const arrRoles = roles.map((role) => {
    return {
      name: role.title,
      value: role.id,
    };
  });
  let response = await inquirer
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
    ]);
  console.log(response.selectEmployee);
  const [newEmployee] = await connection.query(employeeQueries.updateEmployeeRole, [response.selectRole, response.selectEmployee]);
  try {
    console.table('New emoployee:', newEmployee);
  } catch (error) {
    console.log(e);
  }
  promptUser();
};

// view all roles
const viewAllRoles = async () => {
  const [roles] = await connection.query(employeeQueries.viewCustomRolesTable);
  try {
    console.table('All roles:', roles);
  } catch (error) {
    console.log(e);
  }
  promptUser();
};

// view all salary
const viewDeptBudget = async () => {
  const [salary] = await connection.query(employeeQueries.viewDeptBudget);
  try {
    console.table('Total salaries by department:', salary);
  } catch (error) {
    console.log(e);
  }
  promptUser();
};
