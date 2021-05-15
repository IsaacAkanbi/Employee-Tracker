use employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
	id INT AUTO_INCREMENT,
	name VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role (
	id INT AUTO_INCREMENT,
	title VARCHAR(45) NOT NULL,
	salary INT NOT NULL,
	department_id INT NOT NULL,
    PRIMARY KEY(id)
);


CREATE TABLE employee (
  id INT AUTO_INCREMENT,
  first_name VARCHAR(45) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  PRIMARY KEY (id)
);
# seed data
INSERT INTO department VALUES ('TEST');

SELECT * FROM department;
INSERT INTO department (name)
VALUES ("Customer Service"), ("Human Resources"), ("IT"), ("Operations"), ("Logistics"); 
INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 10000, 2), ("Tester", 8500, 3), ("Developer", 9600, 4), ("Business Analyst", 6500, 4), ("Bid Analyst", 7800, 5), ("Solution manager", 8200, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Chris", "Massion", 003, 102), ("Paul", "Gascoline", 005, 104), ("Charle", "Orchard", 006, 109), ("Ben", "Carson", 001, 105), ("Paolo", "Tuliso", 010, 101), ("Jordan", "Alain", 008, 107);
