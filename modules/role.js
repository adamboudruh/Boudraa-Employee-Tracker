const inquirer = require('inquirer');

let db;
const roleSetDB = (database) => {
    db = database;
}

const viewRole = () => { //TABLE: title, id, dep
    return new Promise((resolve, reject) => {
        db.query(`
    SELECT title, role.id, department.name AS department FROM role
        JOIN department
            ON role.department_id = department.id
    `).then(([rows, fields]) => {
            console.table(rows); 
            resolve();
        }).catch((err) => {
            console.log(err);
            reject(err);
        })
    })
}

const addRole = () => { //PROMPTS: title, salary, dep
    return new Promise((resolve, reject) => {
        let departments;
    db.query(`SELECT name FROM department`)
        .then(([rows, fields]) => {
            departments = rows.map(department => department.name) //Turns the rows of departments into a usable array
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
            const { title, salary, dep } = data; //deconstructs the data object for easier use
            return db.query(`SELECT id FROM department WHERE name = ?`, dep)
            .then( (depRow) => {
                depID = depRow[0][0].id;
            return db.query(`
                    INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)
                `, [title, salary, depID])
            })
        }).then(() => resolve())
          .catch( (err) => {
            console.error(`Error in adding employee: ${err}`); 
            reject(err);
        })
    })
}




module.exports = { roleSetDB, viewRole, addRole }