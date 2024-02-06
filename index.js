const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const { addEmp, viewEmp, empSetDB, viewEmpbyManager, upEmp } = require('./modules/employee');
const { addRole, viewRole, roleSetDB } = require('./modules/role');
const { addDpmt, viewDpmt, viewDpmtEmps, viewDpmtBdgt, dpmtSetDB } = require('./modules/department'); //These are all of the functions that are able to interact with the SQL and make queries and such.

function  start() {
    inquirer
        .prompt([
                {
                    type: 'list',
                    name: 'initial',
                    message: 'What would you like to do?',
                    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'View Department Budget', 'View Employees By Department', 'View Employees by Manager', 'Quit']
                }
        ]).then((data) => {
            handleOption(data.initial);
        }).catch((error) => console.log(error));
};

start(); //Runs the initial inquirer prompt

const handleOption =  async (selection) => {
    switch (selection) {
        case 'View All Employees':
            viewEmp().then( () => start()); //In order to both run the function elsewhere while also not having it import the start function, this promise structure is necessary to ensure that the function finishes running before start() is called.
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
        case 'View Department Budget':
            viewDpmtBdgt().then( () => start());
            break;
        case 'View Employees By Department':
            viewDpmtEmps().then( () => start());
            break;
        case 'View Employees by Manager':
            viewEmpbyManager().then( () => start());
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
        empSetDB(connection);
        roleSetDB(connection);
        dpmtSetDB(connection); //These three function calls allow us to export the connection to the database without having the other functions import it, thus creating a cyclical relationship.
        console.log(`Connected to the employee_db database.`);
    }).catch((err) => console.error(`Couldn't connect to database: ${err}`));

    