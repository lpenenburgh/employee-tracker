INSERT INTO department (name)
VALUES ("Sales"),
 ("HR"),
 ("Customer Service"),
 ("Engineering"),
 ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer",150000.00,5),
("Human Resource Manager",65000.00,2),
("Customer Care Agent",45000.00,3),
("Sales Representative",60000.00,1),
("Sales Team Lead",85000.00,1),
("Junior Engineer",65000.00,4),
("Senior Engineer",80000.00,4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Scott", 5, 1), 
("Jim", "Halpert", 4, 1),
("Pam", "Beesly", 3,2),
("Andy","Bernard",5,4),
("Phyllis", "Vance",2,3),
("Dwight", "Shrute",7,1),
("Angela", "Martin",6,6);
