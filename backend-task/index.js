const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const cors = require('cors');
app.use(cors()); 
const port = 8080;

// OPENING THE NEW DATABASE
const db = new sqlite3.Database('./database.sqlite');

// 1.API FOR TRANSACTIONS WITH SEARCH AND PAGINATION
app.get('/transactions', (req, res) => {
  const {
    page = 1,
    perPage = 10,
    title = '',
    price = '',
    month = '',
    category = ''
  } = req.query;
  const offset = (page - 1) * perPage;


  const titleQuery = `%${title}%`;
  const categoryQuery = `%${category}%`;
  let priceQuery = '';
  let monthQuery = '';

  const monthNumber = month ? new Date(Date.parse(month + " 1, 2023")).getMonth() + 1 : null;


  let query = `
    SELECT * FROM Transactions
    WHERE (product_title LIKE ?)
    AND (category LIKE ?)
  `;
  let params = [titleQuery, categoryQuery];


  if (price) {
    query += ` AND price = ?`;
    priceQuery = parseFloat(price);
    params.push(priceQuery);
  }


  if (monthNumber) {
    query += ` AND strftime('%m', dateOfSale) = ?`;
    monthQuery = monthNumber.toString().padStart(2, '0'); // Format month as 2 digits (e.g., '01')
    params.push(monthQuery);
  }


  query += ` LIMIT ? OFFSET ?`;
  params.push(perPage, offset);


  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// 2.API FOR STATISTICS BASED ON MONTH
app.get('/statistics', (req, res) => {
  const { month } = req.query;


  const monthMapping = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };


  const monthNumber = monthMapping[month];

  if (!monthNumber) {
    return res.status(400).json({ error: 'Invalid month provided. Please use full month names like "January", "February", etc.' });
  }


  const query = `
    SELECT
      SUM(price) AS totalSaleAmount,
      COUNT(*) AS totalItemsSold,
      SUM(CASE WHEN sold = 0 THEN 1 ELSE 0 END) AS totalItemsNotSold
    FROM Transactions
    WHERE strftime('%m', dateOfSale) = ?;
  `;


  db.get(query, [monthNumber], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});


// 3.API FOR BAR CHART BASED ON PRICE RANGES

app.get('/bar-chart', (req, res) => {
    let { month } = req.query;
  

    const monthMapping = {
      january: '01',
      february: '02',
      march: '03',
      april: '04',
      may: '05',
      june: '06',
      july: '07',
      august: '08',
      september: '09',
      october: '10',
      november: '11',
      december: '12',
    };
  

    const monthNumber = monthMapping[month];
  
    if (!monthNumber) {
      return res.status(400).json({ error: 'Invalid month provided. Please use full month names like "January", "February", etc.' });
    }
  

    const query = `
      SELECT 
        CASE
          WHEN price BETWEEN 0 AND 100 THEN '0 - 100'
          WHEN price BETWEEN 101 AND 200 THEN '101 - 200'
          WHEN price BETWEEN 201 AND 300 THEN '201 - 300'
          WHEN price BETWEEN 301 AND 400 THEN '301 - 400'
          WHEN price BETWEEN 401 AND 500 THEN '401 - 500'
          WHEN price BETWEEN 501 AND 600 THEN '501 - 600'
          WHEN price BETWEEN 601 AND 700 THEN '601 - 700'
          WHEN price BETWEEN 701 AND 800 THEN '701 - 800'
          WHEN price BETWEEN 801 AND 900 THEN '801 - 900'
          ELSE '901-above'
        END AS priceRange,
        COUNT(*) AS itemCount
      FROM Transactions
      WHERE strftime('%m', dateOfSale) = ?
      GROUP BY priceRange
    `;
  

    db.all(query, [monthNumber], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

  //4.API FOR GETTING PIE CHART

  app.get('/pie-chart', (req, res) => {
    let { month } = req.query;
  

    const monthMapping = {
      january: '01',
      february: '02',
      march: '03',
      april: '04',
      may: '05',
      june: '06',
      july: '07',
      august: '08',
      september: '09',
      october: '10',
      november: '11',
      december: '12',
    };
  

    month = month ? month.toLowerCase() : null;
    const monthNumber = monthMapping[month];
  
    if (!monthNumber) {
      return res.status(400).json({ error: 'Invalid month provided. Please use full month names like "January", "February", etc.' });
    }
  

    const query = `
      SELECT category, COUNT(*) AS itemCount
      FROM Transactions
      WHERE strftime('%m', dateOfSale) = ?
      GROUP BY category
    `;
  

    db.all(query, [monthNumber], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });


//5.API FOR GETTING ALL API DATA

  app.get('/all-data', (req, res) => {
    let { month } = req.query;
  

    const monthMapping = {
      january: '01',
      february: '02',
      march: '03',
      april: '04',
      may: '05',
      june: '06',
      july: '07',
      august: '08',
      september: '09',
      october: '10',
      november: '11',
      december: '12',
    };
  

    month = month ? month.toLowerCase() : null;
    const monthNumber = monthMapping[month];
  
    if (!monthNumber) {
      return res.status(400).json({ error: 'Invalid month provided. Please use full month names like "January", "February", etc.' });
    }
  

    const statisticsQuery = `
      SELECT
        SUM(price) AS totalSaleAmount,
        COUNT(*) AS totalItemsSold,
        SUM(CASE WHEN sold = 0 THEN 1 ELSE 0 END) AS totalItemsNotSold
      FROM Transactions
      WHERE strftime('%m', dateOfSale) = ?;
    `;
  
    const barChartQuery = `
      SELECT 
        CASE
          WHEN price BETWEEN 0 AND 100 THEN '0 - 100'
          WHEN price BETWEEN 101 AND 200 THEN '101 - 200'
          WHEN price BETWEEN 201 AND 300 THEN '201 - 300'
          WHEN price BETWEEN 301 AND 400 THEN '301 - 400'
          WHEN price BETWEEN 401 AND 500 THEN '401 - 500'
          WHEN price BETWEEN 501 AND 600 THEN '501 - 600'
          WHEN price BETWEEN 601 AND 700 THEN '601 - 700'
          WHEN price BETWEEN 701 AND 800 THEN '701 - 800'
          WHEN price BETWEEN 801 AND 900 THEN '801 - 900'
          ELSE '901-above'
        END AS priceRange,
        COUNT(*) AS itemCount
      FROM Transactions
      WHERE strftime('%m', dateOfSale) = ?
      GROUP BY priceRange;
    `;
  
    const pieChartQuery = `
      SELECT category, COUNT(*) AS itemCount
      FROM Transactions
      WHERE strftime('%m', dateOfSale) = ?
      GROUP BY category;
    `;
  

    db.serialize(() => {
      const results = {};
  
      db.get(statisticsQuery, [monthNumber], (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Error fetching statistics data' });
        }
        results.statistics = row;
  
        db.all(barChartQuery, [monthNumber], (err, rows) => {
          if (err) {
            return res.status(500).json({ error: 'Error fetching bar chart data' });
          }
          results.barChart = rows;
  
          db.all(pieChartQuery, [monthNumber], (err, rows) => {
            if (err) {
              return res.status(500).json({ error: 'Error fetching pie chart data' });
            }
            results.pieChart = rows;
  

            res.json(results);
          });
        });
      });
    });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
