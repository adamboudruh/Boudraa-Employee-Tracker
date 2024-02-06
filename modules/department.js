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

module.exports = { addDpmt, viewDpmt, dpmtSetDB };