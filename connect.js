const {viewEmp, addEmp, upEmp, viewRole, addRole, viewDpmt, addDpmt} = require('./query');




function relay(data) {
    switch (data.initial) {
        case 'View All Employees':
            viewEmp(db);
            break;
        case 'Add Employee':
            addEmp(db);
            break;
        case 'Update Employee Role':
            upEmp(db);
            break;  
        case 'View All Roles':
            viewRole(db);
            break;
        case 'Add Role':
            addRole(db);
            break;
        case 'View All Departments':
            viewDpmt(db);
            break;
        case 'Add Department':
            addDpmt(db);
            break;
        case 'Quit':
            break;
    }
}

module.exports = { relay };