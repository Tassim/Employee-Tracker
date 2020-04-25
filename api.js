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
    }
  });
};
promptUser();

// view all employees
const viewAllEmployees = () => {
  const query = 'SELECT * FROM employee;';
  connection.query(query, (err, employee) => {
    if (err) throw err;
    console.table('All employee:', employee);
    promptUser();
  });
};

// view all employees by department
const viewAllEmplByDept = () => {
  inquirer.prompt({
    name: 'department',
    type: 'list',
    message: 'Select a department:',
    choices: [
      'Engineering',
      'Marketing',
      'Accounting',
    ],
  }).then((answer) => {
    const query = `SELECT employee.id, employee.firstName, employee.lastName
    FROM employee 
    INNER JOIN department ON employee.departmentId = department.id
    WHERE department.departmentName = ?;`;
    connection.query(query, answer.department, (err, employee) => {
      if (err) throw err;
      console.table('Employee by department:', employee);
    });
  });
};

// const addEmplyee = () => {
//   inquirer
//     .prompt([
//       {
//         type: 'input',
//         name: 'firstName',
//         message: "What's the employee first Name?",
//       },
//       {
//         type: 'input',
//         name: 'lastName',
//         message: "What's the employee last Name?",
//       },
//       {
//         type: 'list',
//         name: 'role',
//         message: "What's employee role?",
//         choices: [
//           'Engineer Manager',
//           'Engineer Staff',
//           'Marketing Manager',
//           'Marketing Staff',
//           'Accounting Manager',
//           'Accounting Staff',
//         ],
//       },
//       // {
//       //   type: 'list',
//       //   name: 'manager',
//       //   message: "Who's the employee manager?",
//       //   choices: [  ];
//       // }
//     ]).then((response) => {

//       const query = 'SELECT * FROM employee;'
//       connection.query(query, {id});
//       console.log(allEmployees);
//     });
// }


