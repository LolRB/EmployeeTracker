const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");

class EmployeeManager {
  constructor() {
    this.init();
  }

  init() {
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText);
    this.loadMainPrompts();
  }

  async loadMainPrompts() {
    const { choice } = await prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          { name: "View All Employees", value: "VIEW_EMPLOYEES" },
          {
            name: "View All Employees By Department",
            value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
          },
          {
            name: "View All Employees By Manager",
            value: "VIEW_EMPLOYEES_BY_MANAGER",
          },
          { name: "Add Employee", value: "ADD_EMPLOYEE" },
          { name: "Remove Employee", value: "REMOVE_EMPLOYEE" },
          { name: "Update Employee Role", value: "UPDATE_EMPLOYEE_ROLE" },
          { name: "Update Employee Manager", value: "UPDATE_EMPLOYEE_MANAGER" },
          { name: "View All Roles", value: "VIEW_ROLES" },
          { name: "Add Role", value: "ADD_ROLE" },
          { name: "Remove Role", value: "REMOVE_ROLE" },
          { name: "View All Departments", value: "VIEW_DEPARTMENTS" },
          { name: "Add Department", value: "ADD_DEPARTMENT" },
          { name: "Remove Department", value: "REMOVE_DEPARTMENT" },
          {
            name: "View Total Utilized Budget By Department",
            value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT",
          },
          { name: "Quit", value: "QUIT" },
        ],
      },
    ]);

    switch (choice) {
      case "VIEW_EMPLOYEES":
        return this.viewEmployees();
      case "VIEW_EMPLOYEES_BY_DEPARTMENT":
        return this.viewEmployeesByDepartment();
      case "VIEW_EMPLOYEES_BY_MANAGER":
        return this.viewEmployeesByManager();
      case "ADD_EMPLOYEE":
        return this.addEmployee();
      case "REMOVE_EMPLOYEE":
        return this.removeEmployee();
      case "UPDATE_EMPLOYEE_ROLE":
        return this.updateEmployeeRole();
      case "UPDATE_EMPLOYEE_MANAGER":
        return this.updateEmployeeManager();
      case "VIEW_DEPARTMENTS":
        return this.viewDepartments();
      case "ADD_DEPARTMENT":
        return this.addDepartment();
      case "REMOVE_DEPARTMENT":
        return this.removeDepartment();
      case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
        return this.viewUtilizedBudgetByDepartment();
      case "VIEW_ROLES":
        return this.viewRoles();
      case "ADD_ROLE":
        return this.addRole();
      case "REMOVE_ROLE":
        return this.removeRole();
      default:
        return this.quit();
    }
  }

  async viewEmployees() {
    const { rows: employees } = await db.findAllEmployees();
    console.log("\n");
    console.table(employees);
    this.loadMainPrompts();
  }

  async viewEmployeesByDepartment() {
    const { rows: departments } = await db.findAllDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
      name,
      value: id,
    }));

    const { departmentId } = await prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you like to see employees for?",
        choices: departmentChoices,
      },
    ]);

    const { rows: employees } = await db.findAllEmployeesByDepartment(
      departmentId
    );
    console.log("\n");
    console.table(employees);
    this.loadMainPrompts();
  }

  async viewEmployeesByManager() {
    const { rows: managers } = await db.findAllEmployees();
    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    const { managerId } = await prompt([
      {
        type: "list",
        name: "managerId",
        message: "Which employee do you want to see direct reports for?",
        choices: managerChoices,
      },
    ]);

    const { rows: employees } = await db.findAllEmployeesByManager(managerId);
    console.log("\n");
    if (employees.length === 0) {
      console.log("The selected employee has no direct reports");
    } else {
      console.table(employees);
    }
    this.loadMainPrompts();
  }

  async removeEmployee() {
    const { rows: employees } = await db.findAllEmployees();
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    const { employeeId } = await prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: employeeChoices,
      },
    ]);

    await db.removeEmployee(employeeId);
    console.log("Removed employee from the database");
    this.loadMainPrompts();
  }

  async updateEmployeeRole() {
    const { rows: employees } = await db.findAllEmployees();
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    const { employeeId } = await prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's role do you want to update?",
        choices: employeeChoices,
      },
    ]);

    const { rows: roles } = await db.findAllRoles();
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const { roleId } = await prompt([
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to assign the selected employee?",
        choices: roleChoices,
      },
    ]);

    await db.updateEmployeeRole(employeeId, roleId);
    console.log("Updated employee's role");
    this.loadMainPrompts();
  }

  async updateEmployeeManager() {
    const { rows: employees } = await db.findAllEmployees();
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    const { employeeId } = await prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's manager do you want to update?",
        choices: employeeChoices,
      },
    ]);

    const { rows: managers } = await db.findAllPossibleManagers(employeeId);
    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    const { managerId } = await prompt([
      {
        type: "list",
        name: "managerId",
        message:
          "Which employee do you want to set as manager for the selected employee?",
        choices: managerChoices,
      },
    ]);

    await db.updateEmployeeManager(employeeId, managerId);
    console.log("Updated employee's manager");
    this.loadMainPrompts();
  }

  async viewRoles() {
    const { rows: roles } = await db.findAllRoles();
    console.log("\n");
    console.table(roles);
    this.loadMainPrompts();
  }

  async addRole() {
    const { rows: departments } = await db.findAllDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
      name,
      value: id,
    }));

    const role = await prompt([
      { name: "title", message: "What is the name of the role?" },
      { name: "salary", message: "What is the salary of the role?" },
      {
        type: "list",
        name: "department_id",
        message: "Which department does the role belong to?",
        choices: departmentChoices,
      },
    ]);

    await db.createRole(role);
    console.log(`Added ${role.title} to the database`);
    this.loadMainPrompts();
  }

  async removeRole() {
    const { rows: roles } = await db.findAllRoles();
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const { roleId } = await prompt([
      {
        type: "list",
        name: "roleId",
        message:
          "Which role do you want to remove? (Warning: This will also remove employees)",
        choices: roleChoices,
      },
    ]);

    await db.removeRole(roleId);
    console.log("Removed role from the database");
    this.loadMainPrompts();
  }

  async viewDepartments() {
    const { rows: departments } = await db.findAllDepartments();
    console.log("\n");
    console.table(departments);
    this.loadMainPrompts();
  }

  async addDepartment() {
    const { name } = await prompt([
      { name: "name", message: "What is the name of the department?" },
    ]);
    await db.createDepartment({ name });
    console.log(`Added ${name} to the database`);
    this.loadMainPrompts();
  }

  async removeDepartment() {
    const { rows: departments } = await db.findAllDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
      name,
      value: id,
    }));

    const { departmentId } = await prompt([
      {
        type: "list",
        name: "departmentId",
        message:
          "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
        choices: departmentChoices,
      },
    ]);

    await db.removeDepartment(departmentId);
    console.log(`Removed department from the database`);
    this.loadMainPrompts();
  }

  async viewUtilizedBudgetByDepartment() {
    const { rows: departments } = await db.findAllDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
      name,
      value: id,
    }));

    const { departmentId } = await prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you like to see the budget for?",
        choices: departmentChoices,
      },
    ]);

    const {
      rows: [budget],
    } = await db.viewDepartmentBudgets(departmentId);
    console.log("\n");
    console.table(budget);
    this.loadMainPrompts();
  }

  quit() {
    console.log("Goodbye!");
    process.exit();
  }
}

new EmployeeManager();
