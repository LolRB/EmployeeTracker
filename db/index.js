const pool = require("./connection");

class DB {
  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      return await client.query(sql, args);
    } finally {
      client.release();
    }
  }

  findAllEmployees() {
    const sql = `
      SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name AS department, 
        role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM 
        employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON manager.id = employee.manager_id;
    `;
    return this.query(sql);
  }

  findAllPossibleManagers(employeeId) {
    const sql = `
      SELECT 
        id, 
        first_name, 
        last_name 
      FROM 
        employee 
      WHERE 
        id != $1;
    `;
    return this.query(sql, [employeeId]);
  }

  createEmployee(employee) {
    const sql = `
      INSERT INTO employee (first_name, last_name, role_id, manager_id) 
      VALUES ($1, $2, $3, $4);
    `;
    const { first_name, last_name, role_id, manager_id } = employee;
    return this.query(sql, [first_name, last_name, role_id, manager_id]);
  }

  removeEmployee(employeeId) {
    const sql = "DELETE FROM employee WHERE id = $1;";
    return this.query(sql, [employeeId]);
  }

  updateEmployeeRole(employeeId, roleId) {
    const sql = "UPDATE employee SET role_id = $1 WHERE id = $2;";
    return this.query(sql, [roleId, employeeId]);
  }

  updateEmployeeManager(employeeId, managerId) {
    const sql = "UPDATE employee SET manager_id = $1 WHERE id = $2;";
    return this.query(sql, [managerId, employeeId]);
  }

  findAllRoles() {
    const sql = `
      SELECT 
        role.id, 
        role.title, 
        department.name AS department, 
        role.salary 
      FROM 
        role 
        LEFT JOIN department ON role.department_id = department.id;
    `;
    return this.query(sql);
  }

  createRole(role) {
    const sql = `
      INSERT INTO role (title, salary, department_id) 
      VALUES ($1, $2, $3);
    `;
    const { title, salary, department_id } = role;
    return this.query(sql, [title, salary, department_id]);
  }

  removeRole(roleId) {
    const sql = "DELETE FROM role WHERE id = $1;";
    return this.query(sql, [roleId]);
  }

  findAllDepartments() {
    const sql = "SELECT department.id, department.name FROM department;";
    return this.query(sql);
  }

  viewDepartmentBudgets() {
    const sql = `
      SELECT 
        department.id, 
        department.name, 
        SUM(role.salary) AS utilized_budget 
      FROM 
        employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
      GROUP BY 
        department.id, department.name;
    `;
    return this.query(sql);
  }

  createDepartment(department) {
    const sql = "INSERT INTO department (name) VALUES ($1);";
    return this.query(sql, [department.name]);
  }

  removeDepartment(departmentId) {
    const sql = "DELETE FROM department WHERE id = $1;";
    return this.query(sql, [departmentId]);
  }

  findAllEmployeesByDepartment(departmentId) {
    const sql = `
      SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title 
      FROM 
        employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
      WHERE 
        department.id = $1;
    `;
    return this.query(sql, [departmentId]);
  }

  findAllEmployeesByManager(managerId) {
    const sql = `
      SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        department.name AS department, 
        role.title 
      FROM 
        employee 
        LEFT JOIN role ON role.id = employee.role_id 
        LEFT JOIN department ON department.id = role.department_id 
      WHERE 
        manager_id = $1;
    `;
    return this.query(sql, [managerId]);
  }
}

module.exports = new DB();
