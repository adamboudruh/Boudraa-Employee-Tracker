const inquirer = require('inquirer');

let db;
const empSetDB = (database) => {
    db = database;
}


const viewEmp = () => { //TABLE: employee id, fname, lname, title, dpmt, salary
    return new Promise((resolve, reject) => { //Each of these functions in the modules return a promise so we can use .then() back in index.js. This ensures that the function is done displaying before we go back to the main menu, in case something is overwritten.
        db.query(`
            SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee
            JOIN role
                ON employee.role_id = role.id
            JOIN department
                ON role.department_id = department.id
        `).then(([rows, fields]) => {
            console.table(rows); 
            return resolve();
        }).catch((err) => {
            console.log(err);
            reject(err);
        })
    })
}

const viewEmpbyManager = () => { //TABLE: id, fname, lname, title, dep, salary (grouped by manager)
    return new Promise((resolve, reject) => {
        let managers;
        db.query(`SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`)
            .then(([rows, fields]) => {
                managers = rows.map(employee => employee.first_name + " " + employee.last_name)
                return inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Please select a manager to view their employees: ',
                            choices: managers
                        }
                    ])
        }).then((data) => {
            db.query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [data.manager.split(" ")[0], data.manager.split(" ")[1]]).then((managerRow) => { //The split is to separate the manager's first and last name
            managerID = managerRow[0][0].id    
            return db.query(`
                SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee
                JOIN role
                    ON employee.role_id = role.id
                JOIN department
                    ON role.department_id = department.id
                    WHERE employee.manager_id = ?`, managerID)
                .then(([rows, fields]) => console.table(rows))
                .catch((err) => {console.log(`Error displaying employees: ${err}`)})
            }).then( () => {console.log('Success! Employees displayed'); resolve();})
            .catch( (err) => {
                console.log(`Error in accessing department: ${err}`); 
                reject(err);
            })
            }) 
    })
}

const addEmp = () => { //PROMPT: fname, lname, role, manage
    return new Promise((resolve, reject) => {
        let roles, managers; 
    db.query(`SELECT title FROM role`)
        .then(([rows, fields]) => {
            roles = rows.map(role => role.title); //This creates an array of available roles to be displayed to the user
            //console.log(roles);
        return db.query(`SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`);
        }).then(([rows, fields]) => {
            managers = rows.map( (employee) => employee.first_name + " " + employee.last_name); //Does same thing as above but with names
            managers.push('None');
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
                db.query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [manager.split(" ")[0], manager.split(" ")[1]]),
                db.query(`SELECT id FROM role WHERE title = ?`, role)
            ]).then( ([managerRow, roleRow]) => { //Promise.all runs multiple promises at once and returns their return values as an array, which is useful for this case where I have to run two separate queries to get the role_id and the manager_id
                if (manager != 'None'){
                    managerID = managerRow[0][0].id; //This extracts just the id number out of the row object
                } else managerID = null; //'None' can't be the value we put into the manager_id column, so we set it to null
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
                        if (
                            newRole.toLowerCase().includes("lead") || 
                            newRole.toLowerCase().includes("manager") ||
                            newRole.toLowerCase().includes("head")
                            ){ //This isn't perfect, as it assumes that a leadership title would include one of those four words, but I feel it covers most cases
                            console.log("Congrats on the promotion!"); // :)
                            return db.query(`
                                UPDATE employee
                                SET role_id = ?, manager_id = NULL
                                WHERE first_name = ?
                            `, [roleID, employeeName.split(" ")[0]]) //If the employees new role is a manager, that means they wouldn't have a manager anymore, so it would have to be set to null
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


module.exports = { addEmp, viewEmp, empSetDB, upEmp, viewEmpbyManager };


