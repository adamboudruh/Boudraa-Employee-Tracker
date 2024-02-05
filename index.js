const inquirer = require('inquirer');
//const {viewEmp, addEmp, upEmp, viewRole, addRole, viewDpmt, addDpmt} = require('./query');
const relay = require('./connect');
const mysql = require('mysql2/promise');

async function start() {
    let q = false;
    //while (!q){
        const data = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'initial',
                    message: 'What would you like to do?',
                    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
                }
            ]);
        switch (data.initial) {
            case 'View All Employees':
                viewEmp();
                break;
            case 'Add Employee':
                addEmp();
                break;
            case 'Update Employee Role':
                upEmp();
                break;  
            case 'View All Roles':
                viewRole();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewDpmt();
                break;
            case 'Add Department':
                addDpmt();
                break;
            case 'Quit':
                //keepRunning = false;
                return;
        };
    //}
};

start();

let db;
mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'mallory',
      database: 'employee_db'
    }).then((connection) => {
        db = connection;
        console.log(`Connected to the employee_db database.`);
    }).catch((err) => console.error(`Couldn't connect to database: ${err}`));

const viewEmp = () => { //TABLE: employee id, fname, lname, title, dpmt, salary
    db.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee
        JOIN role
            ON employee.role_id = role.id
        JOIN department
            ON role.department_id = department.id
    `)
        .then(([rows, fields]) => {
            console.log('\n\n');
            console.table(rows); 
            start();
        }).catch((err) => {
            console.log(err);
            start();
        })
    
    start();
}

const addEmp = () => { //PROMPT: fname, lname, role, manage
    inquirer
        .createPromptModule([
            {

            },

        ])
}

const upEmp = () => { //PROMPT: select employee to update, new role
    
}

const viewRole = () => { //TABLE: title, role id, dpmt for the role, salary
    db.query(`
    SELECT title, role.id, department.name AS department FROM role
        JOIN department
            ON role.department_id = department.id
    `)
        .then(([rows, fields]) => {
            console.log('\n');
            console.table(rows); 
            start();
        }).catch((err) => {
            console.log(err);
            start();
        })
    
    start();
}

const addRole = () => { //PROMPT: name, salary, dpmt
    
}

const viewDpmt = () => { //TABLE: dpt names and id
    db.query('SELECT * FROM department')
        .then(([rows, fields]) => {
            console.log('\n');
            console.table(rows); 
            start();
        }).catch((err) => {
            console.log(err);
            start();
        })
}

const addDpmt = () => {

}

    