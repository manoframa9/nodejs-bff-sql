const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');  /// for capturing responsetime

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Add more routes as needed
const port = 3000; // Use any port number you prefer
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

//// MS SQL connection /////
const sql = require('mssql');

const config = {
  server: 'sql1',
  database: 'TestDB',
  user: 'SA',
  password: 'P@ssw0rd',
  options: {
    encrypt: true, // Use this for Azure SQL Database
    trustServerCertificate: true
  }
};

//// GET API and return dataset in json ////
app.get('/api/data', (req, res) => {
  sql.connect(config)
    .then(() => {
      const query = 'SELECT * FROM Inventory'; // Replace 'YourTable' with your actual table name

      new sql.Request()
        .query(query)
        .then((result) => {
          res.json(result.recordset);
        })
        .catch((err) => {
          console.error('Error executing query:', err);
          res.status(500).send('Error executing query');
        })
        .finally(() => {
          sql.close();
        });
    })
    .catch((err) => {
      console.error('Error connecting to the database:', err);
      res.status(500).send('Error connecting to the database');
    });
});

//// test capture time of an API
app.get('/api/capture-time', async (req, res) => {
  const url = 'http://localhost:3000/api/data'; // Replace with the URL of the API you want to capture response time for

  try {
    const startTime = process.hrtime();
    const response = await axios.get(url);
    const endTime = process.hrtime(startTime);
    const responseTime = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2); // Calculate response time in milliseconds
    console.log(url + ":response-time: " + responseTime + " ms");
    // console.log(response)
    res.send( response.data );
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error capturing response time');
  }
});

