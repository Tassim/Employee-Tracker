INSERT INTO department (id, departmentName)
VALUES(1, "Engineering"),
(2, "Marketing"),
(3, "Accounting"),
(4, "Legal"),
(5, "HR");

INSERT INTO roles (id, title, salary, departmentId)
VALUES(1,"EngineerManager","200.000",1),
(2,"EngineerStaff","100.000",1),
(3,"MarketingManager","130.000",2),
(4,"MarketingStaff","80.000",2),
(5,"AccountingManager","140.000",3),
(6,"AccountingStaff","82.000",3),
(7,"LegalManager","160.000",4),
(8,"LegalStaff","85.000",4),
(9,"HRManager","120.000",5),
(10,"HRStaff","75.000",5);

INSERT INTO employee (id, firstName, lastName, roleId, managerId)
VALUES(1,"Tassia","Shibuya",5,0),
(2,"Casey","Connor",6,1),
(3,"Gabriel","Connor",1,0),
(4,"Jasper","Connor",2,1);

