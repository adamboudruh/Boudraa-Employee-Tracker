INSERT INTO department (name)
VALUES ("Smaller, playmakers, shot creators"),           
    ("Little bit of everything"),                   
    ("Bigger, defensive anchors, lob threats"),           
    ("Coaching Staff");                                

INSERT INTO role (title, salary, department_id)
VALUES ("Point Guard", 9000000, 1),     
    ("Shooting Guard", 7000000, 1),          
    ("Combo Guard", 9000000, 2),    
    ("Wing", 12000000, 2),          
    ("Small Forward", 7000000, 1),    
    ("Power Forward", 6500000, 3),      
    ("Center", 6500000, 3),            
    ("Head Coach", 5000000, 4);       

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Erik", "Spoelstra", 8, NULL),        
    ("Tom", "Thibodeau", 8, NULL),             
    ("Michael", "Malone", 8, NULL),          
    ("Chris", "Finch", 8, NULL),              
    ("Jaden", "McDaniels", 4, 4),      
    ("Kyle", "Lowry", 1, 1),           
    ("Mitchell", "Robinson", 7, 2),    
    ("Jalen", "Brunson", 1, 2),        
    ("Jamal", "Murray", 3, 3),         
    ("Quentin", "Grimes", 2, 2),       
    ("Jaime", "Jaquez", 5, 1),           
    ("Michael", "Porter Jr.", 5, 3),    
    ("Naz", "Reid", 7, 4),              
    ("Mike", "Conley", 3, 4),          
    ("Aaron", "Gordon", 6, 3);         


-- INSERT INTO department (name)
-- VALUES ("General Merchandise"),
--        ("Electronics"),
--        ("Apparel");

-- INSERT INTO role (title, salary, department_id)
-- VALUES ("GM Team Member", 40000, 1),
--        ("GM Lead", 60000, 1),
--        ("Electronics Representative", 50000, 2),
--        ("Electronics Lead", 65000, 2),
--        ("Apparel Associate", 45000, 3),
--        ("Apparel Lead", 55000, 3);

-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("Joe", "Smith", 3, 4),
--        ("Naymond", "Richardson", 3, 4),
--        ("Rose", "Conaughton", 5, 6),
--        ("Elise", "Grayson", 4, NULL),
--        ("Joshua", "Williams", 2, NULL),
--        ("Carlos", "Rodrigues", 6, NULL),
--        ("Robin", "Haysworth", 3, 4),
--        ("Christine", "Worcestershire", 1, 5),
--        ("Solomon", "Davidson", 5, 6),
--        ("Jamal", "Brown", 1, 5);