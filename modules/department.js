const inquirer = require('inquirer');

let db;
const dpmtSetDB = (database) => db = database;


const viewDpmt = () => { //TABLE: dpt names and id
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM department')
        .then(([rows, fields]) => {
            console.table(rows); 
            resolve();
        }).catch((err) => {
            console.log(err);
            reject(err);
        })
    })
}

const viewDpmtBdgt = () => {
    return new Promise((resolve, reject) => {
        let departments;
        db.query(`SELECT name FROM department`)
            .then(([rows, fields]) => {
                departments = rows.map(department => department.name)
                return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'dep',
                    message: 'Please select a department to view its employees: ',
                    choices: departments
                }
            ])
        }).then((data) => {
            return db.query(`SELECT id FROM department WHERE name = ?`, data.dep)
            .then( (depRow) => {
                depID = depRow[0][0].id;
                return db.query(`
                    SELECT department.name AS Department, SUM(role.salary) AS Budget
                    FROM employee
                    JOIN role
                        ON employee.role_id = role.id
                    JOIN department
                        on role.department_id = department.id
                    WHERE role.department_id = ?
                `, depID)
                .then(([rows, fields]) => console.table(rows))
            }).catch((err) => {console.log(`Error displaying employees: ${err}`)})
        }).then( () => {console.log('Success! Employees displayed'); resolve();})
          .catch( (err) => {
          console.log(`Error in adding department: ${err}`); 
          reject(err);})   
    })
}

const viewDpmtEmps = () => {
    return new Promise((resolve, reject) => {
        let departments;
        db.query(`SELECT name FROM department`)
            .then(([rows, fields]) => {
                departments = rows.map(department => department.name)
                return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'dep',
                    message: 'Please select a department to view its employees: ',
                    choices: departments
                }
            ])
        }).then((data) => {
            return db.query(`SELECT id FROM department WHERE name = ?`, data.dep)
            .then( (depRow) => {
                depID = depRow[0][0].id;
                return db.query(`
                    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary 
                    FROM employee
                    JOIN role
                        ON employee.role_id = role.id
                    WHERE role.department_id = ?
                `, depID)
                .then(([rows, fields]) => console.table(rows))
            }).catch((err) => {console.log(`Error displaying employees: ${err}`)})
        }).then( () => {console.log('Success! Employees displayed'); resolve();})
          .catch( (err) => {
          console.log(`Error in accessing department: ${err}`); 
          reject(err);})
    })
}

const addDpmt = () => { //PROMPTS: name of dpt
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: "depName",
                    message: "Enter the name of the department you would like to add: "
                }
            ]).then( (data) => {
                db.query(`
                    INSERT INTO department (name) 
                    VALUES (?)
                `, data.depName)
            }).then( () => {console.log('Success! Department added'); resolve();})
              .catch( (err) => {
                console.log(`Error in adding department: ${err}`); 
                reject(err);})
    })
}

module.exports = { addDpmt, viewDpmt, viewDpmtEmps, viewDpmtBdgt, dpmtSetDB };