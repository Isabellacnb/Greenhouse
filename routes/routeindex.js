// Dependancies
const express = require("express");
var flash = require("connect-flash");
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");

dotenv.config();
const app = express();

// Constants
const MyPlant = require("../model/myplant");
const PlantType = require("../model/planttype");
const User = require('../model/user');
const verify = require("../middleware/verifyAccess");

// USUARIOS
// Route to render login page
app.get("/login", (req, res) => {
  var message = req.flash('message');
  res.render("login", {message});
});

// Request to validate login
app.post('/login', async (req, res) => {
  var {email, password} = req.body;
  var user = await User.findOne({email: email});

  if (!user) {
    req.flash('message', 'El usuario no existe');
    res.redirect('/login');
  } else {
    var valid = await user.validatePassword(password);
    // if valid --> create token
    if (valid) {
      var token = jwt.sign({id: user.email, permission: true}, process.env.SECRET, {expiresIn: "1h"});
      res.cookie("token", token, {httpOnly: true});
      res.redirect("/");
    } else {
      req.flash('message', 'La contraseña es incorrecta');
      res.redirect('/login');
    }
  }
});

// Route to render register page
app.get("/register", (req, res) => {
  res.render("register");
});

// Request to add user to database and send to login page
app.post('/addUser', async (req,res) => {
  var user = new User(req.body);
  user.password = user.encryptPassword(user.password); // Encrypt user password
  await user.save();
  res.redirect("/login");
});

// Route to log off account
app.get('/logoff', async (req, res) => {
  res.clearCookie("token");
  res.redirect('/');
});

// Route to render add plant page form
app.get("/addplant", async (req, res) => {
  var myplants = await MyPlant.find();
  var planttypes = await PlantType.find();
  res.render("addplant", {myplants, planttypes});
});

// Request to add plant to user profile
app.post("/addmyplant", verify, async(req, res) => {
  var myplant = new MyPlant(req.body);
  myplant.user_id = req.userId;
  await myplant.save();
  req.flash('msg', 'Plant added succesfully!');
  res.redirect("/");
});

// Route to go to user profile information
app.get("/userprofile", verify, async (req, res) => {
  var myplants = await MyPlant.find({user_id: req.userId});
  var user = await User.findOne({email: req.userId})
  console.log(user);
  res.render("userprofile", {myplants, user});
});

// Route to search for the types of plants in the database
app.get("/planttypes", async (req, res) => {
  var planttypes = await PlantType.find();
  res.render("planttypes", {planttypes});
});

// Route to go to the form to add new plant type to the database
app.get("/addplanttype", async(req, res) => {
  res.render("addplanttype");
});

// Request to add a new plant type to database
app.post("/addplanttype", async(req, res) => {
  var planttype = new PlantType(req.body);
  await planttype.save();
});

// Route to see info on selected plant
app.get("/plantinfo/:id", async (req, res) => {
  var id = req.params.id;
  var myplant = await MyPlant.findById(id);
  var planttype = await PlantType.findOne({type: myplant.type});
  res.render("plantinfo", { myplant, planttype });
});

// Request to water selected plant
app.post("/water/:id", async (req, res) => {
  var id = req.params.id;
  var today = new Date();
  await MyPlant.updateOne({ _id: id }, {dateLastWatered: today});
  res.redirect(`/plantinfo/${id}`);
});

// Route to see info on selected plant type
app.get("/planttype/:id", async (req, res) => {
  var id = req.params.id;
  var planttype = await PlantType.findById(id);
  res.render("planttype", { planttype });
});

// Request to delete selected plant
app.get("/delete/:id", async (req, res) => {
  var id = req.params.id;
  await MyPlant.remove({ _id: id });
  res.redirect("/");
});

// Route to go to edit form on selected plant
app.get("/edit/:id", async(req, res) => {
  var id = req.params.id;
  var myplant = await MyPlant.findById(id);
  var planttypes = await PlantType.find();
  var date = (myplant.dateLastWatered).toISOString().split('T')[0];
  res.render("editplant", {myplant, planttypes, date});
});

// Route to update selected plant info
app.post("/edit/:id", async (req, res) => {
  var id = req.params.id;
  await MyPlant.updateOne({ _id: id }, req.body);
  res.redirect(`/plantinfo/${id}`);
});

// Route to home, to see current plants in user's greenhouse
app.get("/", verify, async (req, res) => {
  var msg = req.flash('msg');
  var myplants = await MyPlant.find({user_id: req.userId});
  var planttypes = await PlantType.find();
  res.render("index", { myplants, planttypes, msg });
});

// Route to see all plant types in the api
app.get("/api/planttypes", async (req, res) => {
  var planttypes = await PlantType.find();
  return res.json(planttypes);
});

module.exports = app;
