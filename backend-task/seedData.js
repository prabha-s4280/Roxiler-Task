const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

// Open SQLite3 database
const db = new sqlite3.Database('./database.sqlite');

// Fetch data from the third-party API
axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
  .then(response => {
    const transactions = response.data;

    // Start a transaction to insert multiple records
    db.serialize(() => {
      const stmt = db.prepare("INSERT INTO Transactions (product_title, product_description, price, category, dateOfSale, sold, image) VALUES (?, ?, ?, ?, ?, ?, ?)");

      transactions.forEach((transaction) => {
        stmt.run(
          transaction.title,                // Product title
          transaction.description,          // Product description
          transaction.price,                // Product price
          transaction.category,             // Product category
          transaction.dateOfSale,           // Date of sale
          transaction.sold,                 // Sold status (true/false)
          transaction.image                 // Image URL
        );
      });

      stmt.finalize();  // Finalize the statement to ensure it's executed
    });

    console.log("Data has been inserted successfully!");
  })
  .catch(err => {
    console.error("Error fetching data:", err.message);
  })
  .finally(() => {
    db.close();  // Close the database connection
  });
