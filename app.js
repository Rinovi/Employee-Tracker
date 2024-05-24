const { Pool } = require('pg');
const inquirer = require('inquirer');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Shadows1580',
  port: 5432,
});

pool.connect((err) => {
  if (err) throw err;
  console.log(' Connected to the database');
});

function startApp() {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Update employee manager', 
      'View employees by manager', 
      'Delete a department', 
      'Delete a role', 
      'Delete an employee', 
      'View total utilized budget of a department', 
      'Exit',
    ],
  }).then((answer) => {
    switch (answer.action) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Update employee manager':
        updateEmployeeManager(); 
        break;
      case 'View employees by manager':
        viewEmployeesByManager(); 
        break;
      case 'Delete a department':
        deleteDepartment();
        break;
      case 'Delete a role':
        deleteRole();
        break;
      case 'Delete an employee':
        deleteEmployee(); 
        break;
      case 'View total utilized budget of a department':
        viewDepartmentBudget(); 
        break;
      case 'Exit':
        pool.end();
        break;
    }
  });
}

function viewDepartments() {
  pool.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startApp(); 
  });
}

function viewRoles() {
  pool.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startApp(); 
  });
}

function viewEmployees() {
  const query = `
    SELECT
      e.id AS employee_id,
      e.first_name,
      e.last_name,
      r.title AS job_title,
      d.name AS department,
      r.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.department_id
    LEFT JOIN employee m ON e.manager_id = m.id
  `;

  pool.query(query, (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startApp(); 
  });
}

function addDepartment() {
  inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the name of the department:',
  }).then((answer) => {
    pool.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err, res) => {
      if (err) throw err;
      console.log('Department added!');
      startApp(); 
    });
  });
}

function addRole() {
  // Query to fetch all departments
  const departmentQuery = 'SELECT department_id, name FROM department';

  pool.query(departmentQuery, (err, departmentRes) => {
    if (err) throw err;

    const departmentChoices = departmentRes.rows.map(department => ({
      name: department.name,
      value: department.department_id,
    }));

    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department for the role:',
        choices: departmentChoices,
      }
    ]).then((answers) => {
      const { title, salary, department_id } = answers;
      pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id], (err, res) => {
        if (err) throw err;
        console.log('Role added!');
        startApp();
      });
    });
  });
}

function addEmployee() {
  // Query to fetch all roles
  const roleQuery = 'SELECT id, title FROM role';

  pool.query(roleQuery, (err, roleRes) => {
    if (err) throw err;

    const roleChoices = roleRes.rows.map(role => ({
      name: role.title,
      value: role.id,
    }));

    // Query to fetch all employees (managers)
    const managerQuery = 'SELECT id, CONCAT(first_name, \' \', last_name) AS full_name FROM employee';

    pool.query(managerQuery, (err, managerRes) => {
      if (err) throw err;

      const managerChoices = managerRes.rows.map(manager => ({
        name: manager.full_name,
        value: manager.id,
      }));

      inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'Enter the first name of the employee:',
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'Enter the last name of the employee:',
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Select the role for the employee:',
          choices: roleChoices,
        },
        {
          type: 'list',
          name: 'manager_id',
          message: 'Select the manager for the employee (leave blank if none):',
          choices: managerChoices,
        }
      ]).then((answers) => {
        const { first_name, last_name, role_id, manager_id } = answers;
        pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id], (err, res) => {
          if (err) throw err;
          console.log('Employee added!');
          startApp();
        });
      });
    });
  });
}

function updateEmployeeRole() {
  // Query to fetch all employees
  const employeeQuery = 'SELECT id, first_name, last_name FROM employee';

  // Query to fetch all roles
  const roleQuery = 'SELECT id, title FROM role';

  pool.query(employeeQuery, (err, employeeRes) => {
    if (err) throw err;

    const employeeChoices = employeeRes.rows.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    pool.query(roleQuery, (err, roleRes) => {
      if (err) throw err;

      const roleChoices = roleRes.rows.map(role => ({
        name: role.title,
        value: role.id,
      }));

      inquirer.prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Select the employee to update:',
          choices: employeeChoices,
        },
        {
          type: 'list',
          name: 'new_role_id',
          message: 'Select the new role for the employee:',
          choices: roleChoices,
        }
      ]).then((answers) => {
        const { employee_id, new_role_id } = answers;
        pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [new_role_id, employee_id], (err, res) => {
          if (err) throw err;
          console.log('Employee role updated!');
          startApp();
        });
      });
    });
  });
}

function updateEmployeeManager() {
  // Query to fetch all employees for user selection
  const employeeQuery = 'SELECT id, CONCAT(first_name, \' \', last_name) AS full_name FROM employee';

  pool.query(employeeQuery, (err, employeeRes) => {
    if (err) throw err;

    const employeeChoices = employeeRes.rows.map(employee => ({
      name: employee.full_name,
      value: employee.id,
    }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update manager:',
        choices: employeeChoices,
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the new manager for the employee:',
        choices: employeeChoices,
      }
    ]).then((answers) => {
      const { employee_id, manager_id } = answers;
      pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [manager_id, employee_id], (err, res) => {
        if (err) throw err;
        console.log('Employee manager updated!');
        startApp();
      });
    });
  });
}

function viewEmployeesByManager() {
  // Query to fetch all managers for user selection
  const managerQuery = 'SELECT DISTINCT e.manager_id, CONCAT(m.first_name, \' \', m.last_name) AS manager_name FROM employee e JOIN employee m ON e.manager_id = m.manager_id';

  pool.query(managerQuery, (err, managerRes) => {
    if (err) throw err;

    const managerChoices = managerRes.rows.map(manager => ({
      name: manager.manager_name,
      value: manager.manager_id,
    }));

    inquirer.prompt({
      type: 'list',
      name: 'manager_id',
      message: 'Select a manager to view employees:',
      choices: managerChoices,
    }).then((answer) => {
      const { manager_id } = answer;

      // Query to fetch employees managed by the selected manager
      const employeeQuery = 'SELECT id, first_name, last_name FROM employee WHERE manager_id = $1';

      pool.query(employeeQuery, [manager_id], (err, employeeRes) => {
        if (err) throw err;

        console.table(employeeRes.rows); // Display employees managed by the selected manager
        startApp(); 
      });
    });
  });
}

function deleteDepartment() {
  // Query to fetch all departments for user selection
  const departmentQuery = 'SELECT department_id, name FROM department';

  pool.query(departmentQuery, (err, departmentRes) => {
    if (err) throw err;

    const departmentChoices = departmentRes.rows.map(department => ({
      name: department.name,
      value: department.department_id,
    }));

    inquirer.prompt({
      type: 'list',
      name: 'department_id',
      message: 'Select a department to delete:',
      choices: departmentChoices,
    }).then((answer) => {
      const { department_id } = answer;

      // Query to delete the selected department
      const deleteQuery = 'DELETE FROM department WHERE department_id = $1';

      pool.query(deleteQuery, [department_id], (err, res) => {
        if (err) throw err;

        console.log('Department deleted!');
        startApp(); 
      });
    });
  });
}

function deleteRole() {
  // Query to fetch all roles for user selection
  const roleQuery = 'SELECT id, title FROM role';

  pool.query(roleQuery, (err, roleRes) => {
    if (err) throw err;

    const roleChoices = roleRes.rows.map(role => ({
      name: role.title,
      value: role.id,
    }));

    inquirer.prompt({
      type: 'list',
      name: 'role_id',
      message: 'Select a role to delete:',
      choices: roleChoices,
    }).then((answer) => {
      const { role_id } = answer;

      // Query to delete the selected role
      const deleteQuery = 'DELETE FROM role WHERE id = $1';

      pool.query(deleteQuery, [role_id], (err, res) => {
        if (err) throw err;

        console.log('Role deleted!');
        startApp(); 
      });
    });
  });
}

function deleteEmployee() {
  // Query to fetch all employees for user selection
  const employeeQuery = 'SELECT id, CONCAT(first_name, \' \', last_name) AS full_name FROM employee';

  pool.query(employeeQuery, (err, employeeRes) => {
    if (err) throw err;

    const employeeChoices = employeeRes.rows.map(employee => ({
      name: employee.full_name,
      value: employee.id,
    }));

    inquirer.prompt({
      type: 'list',
      name: 'employee_id',
      message: 'Select an employee to delete:',
      choices: employeeChoices,
    }).then((answer) => {
      const { employee_id } = answer;

      // Query to delete the selected employee
      const deleteQuery = 'DELETE FROM employee WHERE id = $1';

      pool.query(deleteQuery, [employee_id], (err, res) => {
        if (err) throw err;

        console.log('Employee deleted!');
        startApp(); 
      });
    });
  });
}

function viewDepartmentBudget() {
  // Query to fetch all departments for user selection
  const departmentQuery = 'SELECT department_id, name FROM department';

  pool.query(departmentQuery, (err, departmentRes) => {
    if (err) throw err;

    const departmentChoices = departmentRes.rows.map(department => ({
      name: department.name,
      value: department.department_id,
    }));

    inquirer.prompt({
      type: 'list',
      name: 'department_id',
      message: 'Select a department to view the total utilized budget:',
      choices: departmentChoices,
    }).then((answer) => {
      const { department_id } = answer;

      // Query to calculate the total utilized budget of the selected department
      const budgetQuery = 'SELECT SUM(r.salary) AS total_budget FROM employee e JOIN role r ON e.role_id = r.id WHERE r.department_id = $1';

      pool.query(budgetQuery, [department_id], (err, budgetRes) => {
        if (err) throw err;

        const totalBudget = budgetRes.rows[0].total_budget;
        console.log(`Total utilized budget of the department: $${totalBudget}`);
        startApp(); 
      });
    });
  });
}
// Start the application
startApp();