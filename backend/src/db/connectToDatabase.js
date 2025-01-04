import mysql from "mysql2";
const db = mysql.createConnection({
    host: 'localhost', // Your database host
    user: 'root',      // Your database username
    password: 'password', // Your database password
    database: 'testdb'    // Your database name
  });

export default db;