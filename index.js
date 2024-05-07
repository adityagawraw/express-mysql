const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1'

// MySQL Connection Pool
const pool = mysql.createPool({
    host: HOST,
    user: 'root',
    port:'9092',
    password: '12345',
    database: 'db1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.get('/api/users', async (req, res) => {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM t1');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/addUser', async (req, res) => {
    try {
    	addData();
        const [rows, fields] = await pool.query('SELECT * FROM t1');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function addData() {
    try {
        const connection = await pool.getConnection();
        // Insert data into the t1 table
        await connection.query(`
            INSERT INTO t1 (name, age)
            VALUES ('John', 30),
                   ('Alice', 25),
                   ('Bob', 35)
        `);
        connection.release();
        console.log('Data added to the t1 table successfully');
    } catch (error) {
        console.error('Error adding data to the t1 table:', error);
    }
}
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

