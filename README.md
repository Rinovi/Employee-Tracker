# Employee-Tracker

## Description

The following is a JavaScript command-line application created using, Postgres, Node.JS, and Inquirer, which allows the user to fully manage a company's employee databse. Upon starting the application in the console, anyone who uses the application will be greeted with a list of actions which can be taken to view or manage data within the databse, such as adding an employee, or viewing all departments within the company. Furthermore, there is sample data stored in the DB folder, which can be ran using 'npm start', in order to populate some fields within the database. 

* The following image is an example of what one could expect to see upon starting the application :
![Screenshot 2024-05-23 213148](https://github.com/Rinovi/Employee-Tracker/assets/160938078/2c231133-1156-48df-8823-f2aefe84efaa)

## Usage

In order to use this application, I would recommend starting by traversing into the index.js file. From there, go ahead and open the terminal by running 'npm i' to download all the dependencies. Next, run 'npm start' to initalize the port, as well as run the files within the DB folder. Finally, you'll want to head over to the app.js file, and run 'node app.js'. This will initialize an inquirer prompt which offers the following actions :

* 'View all departments',
* 'View all roles',
* 'View all employees',
* 'Add a department',
* 'Add a role',
* 'Add an employee',
* 'Update an employee role',
* 'Update employee manager', 
* 'View employees by manager', 
* 'Delete a department', 
* 'Delete a role', 
* 'Delete an employee', 
* 'View total utilized budget of a department',

Upon selecting any of the actions, simply follow any instructions to complete the action, or, you can simply view the displayed database tables.

* Please click on the following to view a demonstrational video showcasing the functionality of the Employee Tracker application
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/pXT_1XsMwtA/0.jpg)](https://www.youtube.com/watch?v=pXT_1XsMwtA)

## Credits

Credits to Inquirer and Postgres which were used to power this application
* Inquirer - https://www.npmjs.com/package/inquirer/v/8.2.4
* Postgres - https://www.npmjs.com/package/pg
