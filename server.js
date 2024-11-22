const express = require('express');
const sequelize = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'pug');


// Serve the login and index pages
app.get('/', (req, res) => {
  res.render('index');
});
app.use((req, res, next) => { res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://web.kokito741.xyz"); next(); });
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/devices', async (req, res) => {
  const devices = await fetchDevices(); 
  res.json(devices);
});
// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

//const PORT = process.env.PORT || 8080;
//app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

module.exports = app;
