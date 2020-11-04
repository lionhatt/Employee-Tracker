use employee_trackerDB;

insert into department (name)
values ("Sales"), ("Engineering"), ("Legal"), ("Finance");

insert into role (title, salary, department_id)
values ("Salesperson", 60000, 1), ("Software Engineer", 80000, 2), ("Lawyer", 100000, 3), ("Accountant", 80000, 4);

insert into employee (first_name, last_name, role_id, manager_id)
values ("Steve", "Rogers", 1, null), 
("Tony", "Stark", 2, null),
("Thor", null, 3, null),
("Natasha", "Romanoff", 4, null),
("Bruce", "Banner", 2, 2),
("Clint", "Barton", 4, 4),
("Sam", "Wilson", 1, 1),
("Loki", null, 3, 3);