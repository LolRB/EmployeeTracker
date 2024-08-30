# EmployeeTracker

## Description

Employee Tracker is a command-line application built with Node.js, Inquirer, and PostgreSQL that allows business owners to manage their company's employee database. The application provides an interface for non-developers to easily view and interact with information stored in the database, including departments, roles, and employees.

## Table of Contents

- Installation
- Usage
- Features
- Schema

## Usage

To start the application, run the following command in your terminal:

```bash
node index.js
```

You will be presented with a menu of options to manage your company's database, including viewing all departments, roles, and employees, as well as adding and updating information.

## Features

- View All Departments: Displays a formatted table showing department names and their IDs.
- View All Roles: Shows the job title, role ID, department, and salary for each role.
- View All Employees: Displays employee data, including IDs, names, job titles, departments, salaries, and managers.
- Add Department: Prompts for the department name and adds it to the database.
- Add Role: Prompts for the role name, salary, and department, then adds the role to the database.
- Add Employee: Prompts for the employee's name, role, and manager, then adds the employee to the database.
- Update Employee Role: Prompts to select an employee and their new role, updating the information in the database.

## Schema

The database schema consists of three tables:

1. Department

   - id: SERIAL PRIMARY KEY
   - name: VARCHAR(30) UNIQUE NOT NULL

2. Role

   - id: SERIAL PRIMARY KEY
   - title: VARCHAR(30) UNIQUE NOT NULL
   - salary: DECIMAL NOT NULL
   - department_id: INTEGER NOT NULL (References department.id)

3. Employee

   - id: SERIAL PRIMARY KEY
   - first_name: VARCHAR(30) NOT NULL
   - last_name: VARCHAR(30) NOT NULL
   - role_id: INTEGER NOT NULL (References role.id)
   - manager_id: INTEGER (References employee.id)

## Acknowledgements

This project was created as part of a learning exercise and may contain simplistic implementations.
