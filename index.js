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
const multer = require('multer');

const { PORT, NODE_ENV, SESSION_SECRET } = process.env;

const isDev = NODE_ENV === 'development';

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://bellybanclientmanager.web.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));
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
  cookie: { secure: true }  // Set secure to true in production
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(multer({ 
  dest: './uploads/',
  rename: function (fieldname, filename) {
      return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
  },
  onFileUploadStart: function (file) {
      console.error(file.fieldname + ' is starting ...')
  },
  onFileUploadData: function (file, data) {
      console.error(data.length + ' of ' + file.fieldname + ' arrived')
  },
  onFileUploadComplete: function (file) {
      console.error(file.fieldname + ' uploaded to  ' + file.path)
  }
}));


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
