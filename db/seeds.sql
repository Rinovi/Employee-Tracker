-- Insert sample departments
INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('Marketing');

-- Insert sample roles
INSERT INTO role (title, salary, department_id) VALUES ('Sales Manager', 60000, 1), ('Software Engineer', 80000, 2), ('Marketing Specialist', 50000, 3);

-- Insert sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL), ('Jane', 'Smith', 2, 1), ('Alice', 'Johnson', 3, 1);
