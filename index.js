const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const { addEmp, viewEmp, empSetDB, upEmp } = require('./modules/employee');
const { addRole, viewRole, roleSetDB } = require('./modules/role');
const { addDpmt, viewDpmt, dpmtSetDB } = require('./modules/department');

function  start() {
    inquirer
        .prompt([
                {
                    type: 'list',
                    name: 'initial',
                    message: 'What would you like to do?',
                    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
                }
        ]).then((data) => {
            handleOption(data.initial);
        }).catch((error) => console.log(error));
};

start();

const handleOption =  async (selection) => {
    switch (selection) {
        case 'View All Employees':
            viewEmp().then( () => start());
            break;
        case 'Add Employee':
            addEmp().then( () => start());
            break;
        case 'Update Employee Role':
            upEmp().then( () => start());
            break;  
        case 'View All Roles':
            viewRole().then( () => start());
            break;
        case 'Add Role':
            addRole().then( () => start());
            break;
        case 'View All Departments':
            viewDpmt().then( () => start());
            break;
        case 'Add Department':
            addDpmt().then( () => start());
            break;
        case 'Quit':
            return;
    };
}

let db;
mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'mallory',
      database: 'employee_db'
    }).then((connection) => {
        db = connection;
        empSetDB(db);
        roleSetDB(db);
        dpmtSetDB(db);
        console.log(`Connected to the employee_db database.`);
    }).catch((err) => console.error(`Couldn't connect to database: ${err}`));

    