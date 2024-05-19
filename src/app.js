const express = require('express');
const config = require('./config/config');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./config/passport-config');
const mainRoutes = require('./routes/mainRoutes');
const flash = require('connect-flash');


const app = express();

const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));


// Middleware
app.use(cors(config.cors));
app.use(morgan(config.morgan.mode));
app.use(session(config.session));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('../public'));
app.use(flash());
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', mainRoutes);
app.use('/readData', mainRoutes);
app.use('/showCollections', mainRoutes);
app.use('/createForm', mainRoutes);
app.use('/uploadFile', mainRoutes);
app.use('/logout', mainRoutes);
app.use('/user', mainRoutes);
app.use('/save-question-data', mainRoutes);


app.listen(config.express.port, () => {
    console.log(`Server is running on http://localhost:${config.express.port}`);
});

module.exports = app;
