// Dependencies
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require("./config");
const path = require('path')
var cookieParser = require("cookie-parser")
var session = require('express-session');
var flash = require("connect-flash");

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// connection to Mongo db
mongoose.connect(config.db.connectionUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

// importing routes
const indexRoutes = require('./routes/routeindex');

// settings
app.set('port', config.app.port);
app.set('views','views');
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret: 'myscret',
    resave: false,
    saveUninitialized:false
}));
app.use(flash());

// routes
app.use('/', indexRoutes);

app.listen(app.get('port'), () =>{
    console.log(`server on port ${app.get('port')}`);
})


