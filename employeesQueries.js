// Get emplyee
const findAllEmployees = 'SELECT * FROM employee';
const findEmployeesByDpt = `SELECT employee.id, employee.firstName, employee.lastName
    FROM employee 
    INNER JOIN department ON employee.departmentId = department.id
    WHERE department.departmentName = ?;`;
const findEmployeesByManager = 'SELECT * FROM employee WHERE manager = ?;';


// adding employee
const addEmployee = 'INSERT INTO employee SET ?';

// deleting employee
const deleteEmployee = 'DELETE FROM employee WHERE id= ?;';

// updating employee
const updateEmployeeRole = 'UPDATE employee SET roleId = ? WHERE id = ?;';

module.exports = {
  findAllEmployees,
  findEmployeesByDpt,
  findEmployeesByManager,
  addEmployee,
  deleteEmployee,
  updateEmployeeRole,
};
