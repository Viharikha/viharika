const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5098;

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // Replace with your MySQL username
    password: 'root',     // Replace with your MySQL password
    database: 'VEMS', // Replace with your database name
    port: 3307
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.use(bodyParser.json());
app.use(cors());

// Create a new employee
app.post('/employees', (req, res) => {
  const {
    Emp_ID,
    Emp_Name,
    Gender,
    Address,
    Latitude,
    Longitude,
    Phone_Number,
    Emergency_Number,
  } = req.body;

  if (
    !Emp_ID ||
    !Emp_Name ||
    !Gender ||
    !Address ||
    !Latitude ||
    !Longitude ||
    !Phone_Number ||
    !Emergency_Number
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `
    INSERT INTO Employees (Emp_ID, Emp_Name, Gender, Address, Latitude, Longitude, Phone_Number, Emergency_Number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [Emp_ID, Emp_Name, Gender, Address, Latitude, Longitude, Phone_Number, Emergency_Number],
    (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'Employee added successfully', id: result.insertId });
    }
  );
});

// Get all employees
app.get('/employees', (req, res) => {
  connection.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Get an employee by ID
app.get('/employees/:id', (req, res) => {
  connection.query('SELECT * FROM employees WHERE Emp_ID = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error('Error fetching employee:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(result[0]);
  });
});

// Update an employee by ID
app.put('/employees/:id', (req, res) => {
  const {
    Emp_Name,
    Gender,
    Address,
    Latitude,
    Longitude,
    Phone_Number,
    Emergency_Number,
  } = req.body;

  const sql = `
    UPDATE employees
    SET Emp_Name = ?, Gender = ?, Address = ?, Latitude = ?, Longitude = ?, Phone_Number = ?, Emergency_Number = ?
    WHERE Emp_ID = ?
  `;

  connection.query(
    sql,
    [Emp_Name, Gender, Address, Latitude, Longitude, Phone_Number, Emergency_Number, req.params.id],
    (err, result) => {
      if (err) {
        console.error('Error updating employee:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({ message: 'Employee updated successfully' });
    }
  );
});

// Delete an employee by ID
app.delete('/employees/:id', (req, res) => {
  connection.query('DELETE FROM employees WHERE Emp_ID = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
