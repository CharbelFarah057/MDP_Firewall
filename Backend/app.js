const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongo = require('./setup/database');
const usersRouter = require('./routes/users');
const rulesRouter = require('./routes/rules');
const routingRouter = require('./routes/routing');
const networksRouter = require('./routes/networks');
require('dotenv').config();
require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./authenticate');

const app = express();
const port = 3001;

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));

//Allow cors for communication between client and server
app.use(
  cors({
    origin: process.env.REACT_APP_URL,
    credentials: true,
  })
);

app.use(passport.initialize());
app.use('/api/users', usersRouter);
app.use('/api/rules', rulesRouter);
app.use('/api/networks', networksRouter);
app.use('/api/routings', routingRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Database Setup
mongo
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('[SERVER - MONGO] - MongoDB connected');
  })
  .catch((err) => {
    console.log(`[SERVER] - Error connecting to db: ${err}`);
  });

module.exports = app;
