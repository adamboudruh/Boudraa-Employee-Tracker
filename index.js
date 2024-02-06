const inquirer = require('inquirer');
//const {viewEmp, addEmp, upEmp, viewRole, addRole, viewDpmt, addDpmt} = require('./query');
const mysql = require('mysql2/promise');
// require('events').EventEmitter.defaultMaxListeners = 20;

function start() {
    inquirer
        .prompt([
                {
                    type: 'list',
                    name: 'initial',
                    message: 'What would you like to do?',
                    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
                }
        ]).then((data) => {
            handleOption(data);
        })
        
};

start();

const handleOption =  async (data) => {
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
            return;
    };
}

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
            console.log('\n');
            console.table(rows); 
            start();
        }).catch((err) => {
            console.log(err);
            start();
        })
}


const addEmp = () => { //PROMPT: fname, lname, role, manage
        let roles, managers;
        db.query(`SELECT title FROM role`)
            .then(([rows, fields]) => {
                roles = rows.map(role => role.title);
                console.log(roles);
            return db.query(`SELECT first_name FROM employee WHERE manager_id IS NULL`);
            }).then(([rows, fields]) => {
                managers = rows.map( (employee) => employee.first_name);
                managers.push('None');
                console.log(managers);
                return inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'fName',
                            message: 'Please enter a first name for the employee: ',
                        },
                        {
                            type: 'input',
                            name: 'lName',
                            message: 'Please enter a last name:',
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Please select a role: ',
                            choices: roles
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Please select a manager (select none if you are adding a manager): ',
                            choices: managers
                        }
                    ])
            }).then( (data) => {
                const { fName, lName, role, manager } = data;
                Promise.all([
                    db.query(`SELECT id FROM employee WHERE first_name = ?`, manager),
                    db.query(`SELECT id FROM role WHERE title = ?`, role)
                ]).then( ([managerRow, roleRow]) => {
                    if (manager != 'None'){
                        managerID = managerRow[0][0].id;
                    } else managerID = null;
                    console.log(`${managerID} selected`);
                    roleID = roleRow[0][0].id;
                        console.log(`${roleID} selected`);
                    return db.query(`
                    INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)
                `, [fName, lName, roleID, managerID])
                })
            }).then( () => {
                console.log('Success, employee has been added');
                start();
            }).catch( (err) => { console.error(`Error in adding employee: ${err}`); start(); })
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
}

const addRole = () => { //PROMPT: name, salary, dpmt
    let departments;
    db.query(`SELECT name FROM department`)
        .then(([rows, fields]) => {
            departments = rows.map(department => department.name)
            console.log(departments);
            return inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Please enter the title of the role: ',
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Please enter salary for the role:',
                    },
                    {
                        type: 'list',
                        name: 'dep',
                        message: 'Please select a department: ',
                        choices: departments
                    }
                ])
        }).then( (data) => {
            const { title, salary, dep } = data;
            return db.query(`SELECT id FROM department WHERE name = ?`, dep)
            .then( (depRow) => {
                depID = depRow[0][0].id;
            return db.query(`
                    INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)
                `, [title, salary, depID])
            })
        }).then(() => {
            console.log('SUCCESSS!!!');
            start();
        }).catch( (err) => {
            console.error(`Error in adding employee: ${err}`); 
            start();
        })
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

    