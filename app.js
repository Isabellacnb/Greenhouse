// Dependencies
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path')
var cookieParser = require("cookie-parser")
var session = require('express-session');
var flash = require("connect-flash");
var dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// connection to Mongo db
mongoose.connect(process.env.MONGODB_HOST,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(db => console.log('db connected - ', process.env.MONGODB_HOST))
    .catch(err => console.log(err));

// importing routes
const indexRoutes = require('./routes/routeindex');

// settings
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

app.listen(process.env.PORT, () =>{
    console.log(`server on port ${process.env.PORT}`);
});


