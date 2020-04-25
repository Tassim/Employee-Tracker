const mysql = require("mysql2");
const cTable = require('console.table');
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'team_db'
}).promise();

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

const promptUser = async () =>  {
  const answer = inquirer.prompt({
      type: 'list',
      name: 'firstOChoices',
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
      ]
    })
    .then(answer => {
      .switch (answer.promptMenuTask) {
        case 'View All Employees';


          break;
        case 'View All Employees By Department';

          break;
        case 'View All Employees By Manager';

          break;
        case 'Add Employee';

          break;
        case 'Remove Employee';

          break;
        case 'Update Employee Role';

          break;
        case 'Update Employee NavigationPreloadManager';

          break;
        case 'View All Roles';

          break;
      }
    });
};
const addEmplyee = () => {
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
        name: 'role',
        message: "What's employee role?",
        choices: [ 'Engineer Manager', 'Engineer Staff', 'Marketing Manager', 'Marketing Staff', 'Accounting Manager', 'Accounting Staff' ]; 
      },
      // {
      //   type: 'list',
      //   name: 'manager',
      //   message: "Who's the employee manager?",
      //   choices: [  ];
      // }
    ]).then( async (response) => {

      const query = 'SELECT * FROM employee;'
      const allEmplyees = await connection.query(query, {id})

    })
}