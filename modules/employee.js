const inquirer = require('inquirer');

let db;
const empSetDB = (database) => {
    db = database;
}


const viewEmp = () => { //DISPLAYS: employee id, fname, lname, title, dpmt, salary
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee
            JOIN role
                ON employee.role_id = role.id
            JOIN department
                ON role.department_id = department.id
        `).then(([rows, fields]) => {
            console.table(rows); 
            return resolve();
            //start();
        }).catch((err) => {
            console.log(err);
            reject(err);
        })
    })
    
}

const addEmp = () => { //PROMPT: fname, lname, role, manage
    return new Promise((resolve, reject) => {
        let roles, managers;
    db.query(`SELECT title FROM role`)
        .then(([rows, fields]) => {
            roles = rows.map(role => role.title);
            //console.log(roles);
        return db.query(`SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`);
        }).then(([rows, fields]) => {
            managers = rows.map( (employee) => employee.first_name + " " + employee.last_name);
            managers.push('None');
            //console.log(managers);
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
                db.query(`SELECT id FROM employee WHERE first_name = ?`, manager.split(" ")[0]),
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
            resolve();
        }).catch( (err) => { 
            console.error(`Error in adding employee: ${err}`); 
            reject(err);
        })

    })
}

const upEmp = () => { //PROMPT: select employee to update, new role
    return new Promise((resolve, reject) => {
        let employees, roles;
        db.query(`SELECT first_name, last_name FROM employee`)
            .then(([rows, fields]) => {
                employees = rows.map(employee => (employee.first_name + " " + employee.last_name));
                return db.query(`SELECT title FROM role`)
                .then(([rows, fields]) => {
                    roles = rows.map(role => role.title);
                    return inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'employeeName',
                            message: 'Please select the employee that you would like to update the role for: ',
                            choices: employees
                        },
                        {
                            type: 'list',
                            name: 'newRole',
                            message: 'Please select the new role for this employee',
                            choices: roles
                        }
                    ])
                }).then((data) => {
                    const { employeeName, newRole } = data;
                    return db.query(`SELECT id FROM role WHERE title = ?`, newRole)
                    .then((newRoleRow) => {
                        const roleID = newRoleRow[0][0].id;
                        if (newRole.toLowerCase().includes("lead") || newRole.toLowerCase().includes("manager")){
                            console.log("Congrats on the promotion!");
                            return db.query(`
                                UPDATE employee
                                SET role_id = ?, manager_id = NULL
                                WHERE first_name = ?
                            `, [roleID, employeeName.split(" ")[0]])
                        } else {
                            return db.query(`
                                UPDATE employee
                                SET role_id = ?
                                WHERE first_name = ?
                            `, [roleID, employeeName.split(" ")[0]])
                        }
                        
                    })
                }).then(() => console.log(`Success!`))
                      .catch((err) => console.log(`Error in updating employee role: ${err}`))
                }).then(() => resolve())
                  .catch((err) => {
                    console.log(err);
                    reject(err);
                })
            })
    }


module.exports = { addEmp, viewEmp, empSetDB, upEmp };


