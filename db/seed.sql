-- Connect to the database
\c employees

INSERT INTO department
    (name)
VALUES
    ('Marketing'),
    ('Product Development'),
    ('Human Resources'),
    ('Customer Support');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Marketing Manager', 95000, 1),
    ('Content Strategist', 75000, 1),
    ('Product Manager', 145000, 2),
    ('UX Designer', 110000, 2),
    ('HR Manager', 130000, 3),
    ('Recruiter', 90000, 3),
    ('Support Lead', 85000, 4),
    ('Customer Support Specialist', 60000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Alice', 'Johnson', 1, NULL),
    ('Bob', 'Smith', 2, 1),
    ('Carol', 'Nguyen', 3, NULL),
    ('David', 'Lee', 4, 3),
    ('Emma', 'Garcia', 5, NULL),
    ('Frank', 'Martinez', 6, 5),
    ('Grace', 'Kim', 7, NULL),
    ('Henry', 'Clark', 8, 7);
