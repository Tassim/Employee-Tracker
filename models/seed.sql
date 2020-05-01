INSERT INTO department (id, departmentName)
VALUES(1, "Engineering"),
(2, "Marketing"),
(3, "Accounting"),
(4, "Legal"),
(5, "HR");

INSERT INTO roles (id, title, salary, departmentId)
VALUES(1,"Engineer Manager","200000",1),
(2,"Engineer Staff","100000",1),
(3,"Marketing Manager","130000",2),
(4,"Marketing Staff","80000",2),
(5,"Accounting Manager","140000",3),
(6,"Accounting Staff","82000",3),
(7,"Legal Manager","160000",4),
(8,"Legal Staff","85000",4),
(9,"HR Manager","120000",5),
(10,"HR Staff","75000",5);

INSERT INTO employee (id, firstName, lastName, roleId, managerId)
VALUES(1,"Tassia","Shibuya",5,0),
(2,"Casey","Connor",6,1),
(3,"Gabriel","Connor",1,0),
(4,"Jasper","Connor",2,1);

