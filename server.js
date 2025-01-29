const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: 'database.kokito741.xyz',
  user: 'website',
  password: 'Afd3zi&aM4v7GX,',
  database: 'sensor-data'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server!');
});

// Serve the login and index pages
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.render('index');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT user_id, username FROM user WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.userId = results[0].user_id;
      req.session.username = results[0].username;
      res.redirect('/');
    } else {
      res.send('Invalid email or password');
    }
  });
});

app.get('/data', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  const query = `
   SELECT dl.device_name, dl.device_location, dl.device_battery, ds.temp, ds.humanity, ds.data_taken
    FROM \`device-sensors\` ds
    JOIN \`devise-list\` dl ON ds.device_id = dl.device_id
    WHERE dl.user_id = ?
  `;
  connection.query(query, [req.session.userId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;