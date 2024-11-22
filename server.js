const express = require('express');
const sequelize = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'pug');

// Routes
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);

// Serve the login and index pages
app.get('/', (req, res) => {
  res.render('index');
});
app.use((req, res, next) => { res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://web.kokito741.xyz"); next(); });
app.get('/login', (req, res) => {
  res.render('login');
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
