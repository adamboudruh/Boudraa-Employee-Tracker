INSERT INTO department (id, name)
VALUES ("1", "General Merchandise"),
       ("2", "Electronics"),
       ("3", "Apparel");

INSERT INTO role (id, title, salary, department_id)
VALUES ("1", "GM Team Member", 40000, 1),
       ("2", "GM Lead", 60000, 1),
       ("3", "Electronics Representative", 50000, 2),
       ("4", "Electronics Lead", 65000, 2),
       ("5", "Apparel Associate", 45000, 3),
       ("6", "Apparel Lead", 55000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES ("1", "Jaden", "McDaniels", 3, 4),
       ("2", "Jaime", "Jaquez", 3, 4),
       ("3", "Pat", "Conaughton", 5, 6),
       ("4", "Collin", "Gillespie", 4, NULL),
       ("5", "Jaylin", "Williams", 2, NULL),
       ("6", "Quentin", "Grimes", 6, NULL),
       ("7", "Robin", "Lopez", 3, 4),
       ("8", "Killian", "Hayes", 1, 5),
       ("9", "Dennis", "Smith Jr.", 5, 6),
       ("10", "Mike", "Conley", 1, 5);