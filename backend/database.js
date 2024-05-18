const { Pool, Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'admin',
  port: 5432
});

(async () => {
  try {
    await client.connect();

    // Check if the database already exists
    const result = await client.query(
      `SELECT datname FROM pg_database WHERE datname = 'cos730_db'`
    );

    if (result.rows.length > 0) {
      console.log('The database "cos730_db" exists.');

      try {
        // Drop tables (if they exist) before reconnecting
        await client.query(`
          DROP TABLE IF EXISTS users;
          DROP TABLE IF EXISTS etf;
        `);
      } catch (error) {
        console.error('Error dropping tables:', error);
        // Handle any errors specifically related to dropping tables
      }

      client.end();
    } 
    else 
    {
      console.log('The database "cos730_db" does not exist.');
      console.log('Creating database cos730_db.....');

      await client.query('CREATE DATABASE cos730_db');

      client.end();
    }

    // Connect to the newly created or existing database
    const clientNew = new Client({
      user: 'postgres',
      host: 'localhost',
      password: 'admin',
      port: 5432,
      database: 'cos730_db' // Use the correct database name
    });

    await clientNew.connect();

    // Create tables with informative error handling
    try {
      await clientNew.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(9) PRIMARY KEY,
          fname VARCHAR(100),
          lname VARCHAR(100),
          email VARCHAR(60),
          company VARCHAR(500),
          portfolio JSONB,
          role VARCHAR(500)
        );

        CREATE TABLE IF NOT EXISTS etf(
            ticker VARCHAR(10) PRIMARY KEY,
            issuer VARCHAR(500),
            name VARCHAR(500)
        );
      `);

      console.log('Tables created successfully.');
    } catch (error) {
      console.error('Error creating tables:', error);
      // Handle any specific errors related to table creation
    }

    // Verification query (optional)
    const results = await clientNew.query('SELECT * FROM users');

    if (results) {
      console.log('Database and tables verified successfully.');
    } else {
      console.log('Database and tables verification unsuccessful.');
    }

    clientNew.end();
  } catch (error) {
    console.error('Error:', error);
  }
})();
