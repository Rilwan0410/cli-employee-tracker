

DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

use employees_db;

CREATE TABLE department(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) 
);

CREATE TABLE role(
    id INT  PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT ,
    CONSTRAINT FK_departmentID FOREIGN KEY (department_id) REFERENCES department(id) 
);


CREATE TABLE employee(
    id INT PRIMARY KEY  AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id  INT ,
    CONSTRAINT FK_roleID FOREIGN KEY (role_id) REFERENCES role(id),
    CONSTRAINT FK_managerID FOREIGN KEY (manager_id) REFERENCES employee(id)
);