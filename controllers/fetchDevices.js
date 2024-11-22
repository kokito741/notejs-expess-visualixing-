const mysql = require('mysql2/promise');

async function fetchDevices() {
  try {
    const connection = await mysql.createConnection({
      host: 'your_db_host',
      user: 'your_db_user',
      password: 'your_db_password',
      database: 'your_db_name'
    });

    const [rows] = await connection.execute('SELECT * FROM devices');

    // Instead of appending rows directly, you would send this data to the client-side
    connection.end();
    
    return rows;

  } catch (error) {
    console.error('Error fetching devices:', error);
  }
}
module.exports = fetchDevices;
