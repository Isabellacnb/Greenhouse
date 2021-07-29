const express = require("express");
var flash = require("connect-flash");
var jwt = require("jsonwebtoken");

const app = express();

const MyPlant = require("../model/myplant");
const PlantType = require("../model/planttype");
const User = require('../model/user');
const verify = require("../middleware/verifyAccess");

// USUARIOS
// Ruta para user login
app.get("/login", (req, res) => {
  var message = req.flash('message');
  res.render("login", {message});
});

// Ruta para hacer el login
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
      var token = jwt.sign({id: user.email, permission: true}, "abcd1234", {expiresIn: "1h"});
      res.cookie("token", token, {httpOnly: true});
      res.redirect("/");
    } else {
      req.flash('message', 'La contraseña es incorrecta');
      res.redirect('/login');
    }
  }
});

// Ruta para user login
app.get("/register", (req, res) => {
  res.render("register");
});

app.post('/addUser', async (req,res) => {
  var user = new User(req.body);
  user.password = user.encryptPassword(user.password);
  await user.save()
  res.redirect("/login")
});

app.get('/logoff', async (req, res) => {
  res.clearCookie("token");
  res.redirect('/');
});

// Ruta para agregar plantas
app.get("/addplant", async (req, res) => {
  var myplants = await MyPlant.find();
  var planttypes = await PlantType.find();
  res.render("addplant", {myplants, planttypes});
});

app.post("/addmyplant", verify, async(req, res) => {
  var myplant = new MyPlant(req.body);
  myplant.user_id = req.userId;
  await myplant.save();
  res.redirect("/");
});

// Ruta para ver perfil de usuario
app.get("/userprofile", verify, async (req, res) => {
  var myplants = await MyPlant.find({user_id: req.userId});
  var user = await User.findOne({email: req.userId})
  console.log(user);
  res.render("userprofile", {myplants, user});
});

// Ruta para buscar tipos de plantas
app.get("/planttypes", async (req, res) => {
  var planttypes = await PlantType.find();
  res.render("planttypes", {planttypes});
});

// Ruta para admin para agregar un tipo de planta
app.get("/addplanttype", async(req, res) => {
  res.render("addplanttype");
});

app.post("/addplanttype", async(req, res) => {
  var planttype = new PlantType(req.body);
  await planttype.save();
});

// Ruta para ver info de mi planta
app.get("/plantinfo/:id", async (req, res) => {
  var id = req.params.id;
  var myplant = await MyPlant.findById(id);
  var planttype = await PlantType.findOne({type: myplant.type});
  res.render("plantinfo", { myplant, planttype });
});

// Water your plant
app.post("/water/:id", async (req, res) => {
  var id = req.params.id;
  var today = new Date();
  await MyPlant.updateOne({ _id: id }, {dateLastWatered: today});
  res.redirect(`/plantinfo/${id}`);
});

// Ruta para ver info del tipo de planta
app.get("/planttype/:id", async (req, res) => {
  var id = req.params.id;
  var planttype = await PlantType.findById(id);
  res.render("planttype", { planttype });
});

// Ruta que nos permita eliminar plantas de la greenhouse
app.get("/delete/:id", async (req, res) => {
  var id = req.params.id;
  await MyPlant.remove({ _id: id });
  res.redirect("/");
});

// Ruta para editar los datos en pagina editplant
app.get("/edit/:id", async(req, res) => {
  var id = req.params.id;
  var myplant = await MyPlant.findById(id);
  var planttypes = await PlantType.find();
  var date = (myplant.dateLastWatered).toISOString().split('T')[0];
  res.render("editplant", {myplant, planttypes, date});
});

app.post("/edit/:id", async (req, res) => {
  var id = req.params.id;
  await MyPlant.updateOne({ _id: id }, req.body);
  res.redirect(`/plantinfo/${id}`);
});

// Regresaria las plantas guardadas para la greenhouse actual
app.get("/", verify, async (req, res) => {
  var myplants = await MyPlant.find({user_id: req.userId});
  var planttypes = await PlantType.find();
  res.render("index", { myplants, planttypes });
});

app.get("/api/planttypes", async (req, res) => {
  var planttypes = await PlantType.find();
  return res.json(planttypes);
});



module.exports = app;
