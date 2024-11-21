const express = require('express');
const sequelize = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'pug');

const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);

// Serve the login and index pages
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
