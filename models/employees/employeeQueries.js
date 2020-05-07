// view all tables
const viewAllEmpl = 'SELECT * FROM employee';
const viewAllRoles = 'SELECT * FROM roles';
const viewAllDept = 'SELECT * FROM department';

// view custom
const viewAllEmployees = `SELECT employee.id AS employeeId, firstName, lastName, title, salary, departmentName 
FROM employee 
LEFT JOIN roles 
ON employee.roleId = roles.id 
LEFT JOIN department 
ON roles.departmentId = department.id;`;
const viewAllEmplByManager = `SELECT * FROM employee 
LEFT JOIN roles ON roles.id = employee.roleId 
LEFT JOIN department ON department.id = roles.departmentId WHERE employee.managerId = ?`;
const viewAllemplbyDept = `SELECT employee.id AS employeeId, firstName, lastName, title, salary, departmentName FROM employee LEFT JOIN roles ON employee.roleId = roles.id LEFT JOIN department ON roles.departmentId = department.id
WHERE department.departmentName = ?;`;

const viewDeptBudget = `SELECT department.id, departmentName, SUM(roles.salary) AS totalSalary
FROM employee 
LEFT JOIN roles
ON employee.roleId = roles.id
LEFT JOIN department 
ON roles.departmentId = department.id
GROUP BY department.id;`;

const viewEmplById = 'SELECT * FROM employee WHERE id = ?';
const viewCustomRolesTable = 'SELECT id AS roleID, title, salary FROM roles';

// add employee
const addEmployee = 'INSERT INTO employee SET ?';

// add role
const addRole = 'INSERT INTO roles SET ?';

// update employee
const updateEmployeeRole = 'UPDATE employee SET roleId = ? WHERE employee.id = ?';

// delete employee
const deleteEmployee = 'DELETE FROM employee WHERE id = ?;';

module.exports = {
  viewAllEmpl,
  viewAllRoles,
  viewAllDept,
  viewAllEmployees,
  viewAllEmplByManager,
  viewAllemplbyDept,
  viewEmplById,
  viewCustomRolesTable,
  addEmployee,
  addRole,
  updateEmployeeRole,
  deleteEmployee,
  viewDeptBudget,
};
