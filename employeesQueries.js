// Get emplyee
const findAllEmployees = 'SELECT * FROM employee';
const findEmployeesByDpt = 'SELECT * FROM employee WHERE department = ?;';
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
