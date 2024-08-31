-- Delete the database if it already exists
DROP DATABASE IF EXISTS company_db;

-- Create a fresh database
CREATE DATABASE company_db;

-- Switch to the new database
\connect company_db

-- Generate the table for departments
CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(50) NOT NULL UNIQUE
);

-- Generate the table for roles
CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_title VARCHAR(50) NOT NULL UNIQUE,
  role_salary NUMERIC NOT NULL,
  dept_id INTEGER NOT NULL,
  CONSTRAINT fk_dept FOREIGN KEY (dept_id) REFERENCES departments(department_id) ON DELETE CASCADE
);

-- Generate the table for employees
CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  position_id INTEGER NOT NULL,
  manager_ref INTEGER,
  CONSTRAINT fk_position FOREIGN KEY (position_id) REFERENCES roles(role_id) ON DELETE CASCADE,
  CONSTRAINT fk_manager_ref FOREIGN KEY (manager_ref) REFERENCES employees(employee_id) ON DELETE SET NULL
);
