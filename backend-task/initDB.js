const sqlite3 = require('sqlite3').verbose();

// Open SQLite3 database (it will create the database file if it doesn't exist)
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create the Transactions table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    dateOfSale TEXT NOT NULL, 
    sold BOOLEAN NOT NULL,
    image TEXT NOT NULL
  );
`;

// Execute the table creation query
db.run(createTableQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  } else {
    console.log("Transactions table is ready.");
  }
});

// Close the database connection
db.close();
