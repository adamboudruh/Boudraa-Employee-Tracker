INSERT INTO department (name)
VALUES ("General Merchandise"),
       ("Electronics"),
       ("Apparel");

INSERT INTO role (title, salary, department_id)
VALUES ("GM Team Member", 40000, 1),
       ("GM Lead", 60000, 1),
       ("Electronics Representative", 50000, 2),
       ("Electronics Lead", 65000, 2),
       ("Apparel Associate", 45000, 3),
       ("Apparel Lead", 55000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jaden", "McDaniels", 3, 4),
       ("Jaime", "Jaquez", 3, 4),
       ("Pat", "Conaughton", 5, 6),
       ("Collin", "Gillespie", 4, NULL),
       ("Jaylin", "Williams", 2, NULL),
       ("Quentin", "Grimes", 6, NULL),
       ("Robin", "Lopez", 3, 4),
       ("Killian", "Hayes", 1, 5),
       ("Dennis", "Smith Jr.", 5, 6),
       ("Mike", "Conley", 1, 5);