const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// let db;
// mysql.createConnection(
//     {
//       host: 'localhost',
//       // MySQL username,
//       user: 'root',
//       // MySQL password
//       password: 'mallory',
//       database: 'employee_db'
//     }).then((connection) => {
//         db = connection;
//         console.log(`Connected to the employee_db database.`);
//     }).catch((err) => console.error(`Couldn't connect to database: ${err}`));



const addEmp = (db) => { //PROMPT: fname, lname, role, manage
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'logoName',
                message: 'Enter 3 characters to appear on your logo: ',
            },
            {
                type: 'input',
                name: 'textColor',
                message: 'Enter a color keyword (or a hexadecimal number) for the text:',
            },
            {
                type: 'input',
                name: 'logoName',
                message: 'Enter 3 characters to appear on your logo: ',
            },
            {
                type: 'input',
                name: 'textColor',
                message: 'Enter a color keyword (or a hexadecimal number) for the text:',
            }
        ]).
}

const upEmp = () => { //PROMPT: select employee to update, new role
    
}

const viewRole = () => { //TABLE: title, role id, dpmt for the role, salary
    
}

const addRole = () => { //PROMPT: name, salary, dpmt
    
}

const viewDpmt = () => { //TABLE: dpt names and id
    db.query('SELECT id, name FROM department')
        .then(([rows, fields]) => {
            console.log("\n\n\n");
            console.table(rows); 
        }).catch((err) => {
            console.log(err);
        });
}

const addDpmt = () => {

}

module.exports = { viewEmp, addEmp, upEmp, viewRole, addRole, viewDpmt, addDpmt };