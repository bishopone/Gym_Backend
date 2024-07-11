require('dotenv').config();;
const routes = require('./routes');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('./config/passport-config');
const flash = require('connect-flash');
const session = require('express-session');

const express = require('express');

const { PORT, NODE_ENV, SESSION_SECRET } = process.env;

const isDev = NODE_ENV === 'development';

const app = express();

// if (isDev) {
// }
app.use(
    cors({
      origin: process.env.CLIENT_URL,
      optionsSuccessStatus: 200,
      credentials: true,
    })
);
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: !isDev }  // Set secure to true in production
}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ type: 'application/json' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: !isDev }  // Set secure to true in production
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error("\x1b[31m", err);
  if (res.headersSent) {
       return next(err);
   }
   res.status(err.status || 500).json({
       message: err.message || "Internal Server Error",
   });
});

app.listen(PORT || 5000, (error) => {
  if (error) {
      console.log("Error in server setup");
      return;
  }
  console.log("Server listening on Port", PORT);
});
