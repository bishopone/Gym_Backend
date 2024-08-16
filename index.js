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
const fileUpload = require('express-fileupload');

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
// app.use(express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }  // Set secure to true in production
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(fileUpload());

const errorHandlingMiddleware = (req, res, next) => {
  // Store the original send method
  console.log("res.send")
  console.log(res.send)
  const originalSend = res.send;
  
  // Override the send method to intercept the response
  res.send = function (body) {
    // Check if there's an error from previous middleware
    const error = res.locals.error;

    // Determine the ISERROR flag and message
    const isError = Boolean(error);
    const defaultMessages = {
      GET: 'Fail to fetch',
      DELETE: 'Fail to delete',
      PUT: 'Fail to update',
      POST: 'Fail to create',
    };
    
    const message = isError
      ? (req.method === 'GET' ? defaultMessages.GET : defaultMessages[req.method] || 'An error occurred')
      : (req.method === 'DELETE' ? 'Successfully deleted' : 'Operation successful');

    // Add ISERROR flag and message to the response
    const responseBody = {
      ...JSON.parse(body),
      ISERROR: isError,
      MESSAGE: isError ? message : undefined
    };

    // Call the original send method with the modified body
    originalSend.call(this, JSON.stringify(responseBody));
  };
  
  next();
};
app.use((err, req, res, next) => {
  // Set error information in res.locals
  res.locals.error = err;
  next(); // Pass the error to the next middleware
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', routes);
app.use(errorHandlingMiddleware);

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
