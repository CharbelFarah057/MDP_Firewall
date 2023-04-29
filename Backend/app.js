const express = require('express');
var bodyParser = require("body-parser");
var cors = require("cors");
var passport = require("passport");
const cookieParser = require("cookie-parser")

require("dotenv").config();

const mongo = require("./setup/database");
 

const app = express();
const port = 3000;

var usersRouter = require("./routes/users")
var rulesRouter = require("./routes/rules")
var networksRouter = require("./routes/networks")

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");


// Body Parser Middleware
app.use((req, res, next) => {
  bodyParser.json()(req, res, next);
});
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET)) // provide a secret key for signed cookies

app.use(passport.initialize())


app.use("/api/users", usersRouter);
app.use("/api/rules", rulesRouter);
app.use("/api/networks", networksRouter);


//Allow cors for communication between client and server
app.use(
  cors({
    origin: process.env.REACT_APP_URL, // location of the react app were connecting to
    credentials: true,
  })
);


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
    console.log("[SERVER - MONGO] - MongoDB connected");
  })
  .catch((err) => {
    console.log(`[SERVER] - Error connecting to db: ${err}`);
  });

module.exports = app;
