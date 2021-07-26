const express = require("express");
const app = express();

const MyPlant = require("../model/myplant");
const PlantType = require("../model/planttype");


// Ruta para agregar plantas
app.get("/addplant", async (req, res) => {
  var myplants = await MyPlant.find();
  var planttypes = await PlantType.find();
  res.render("addplant", {myplants, planttypes});
});

app.post("/addmyplant", async(req, res) => {
  var myplant = new MyPlant(req.body);
  await myplant.save();
  res.redirect("/");
});

// Ruta para ver perfil de usuario
app.get("/userprofile", async (req, res) => {
  res.render("userprofile");
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
  res.render("editplant", {myplant, planttypes});
});

app.post("/edit/:id", async (req, res) => {
  var id = req.params.id;
  await MyPlant.updateOne({ _id: id }, req.body);
  res.redirect(`/plantinfo/${id}`);
});

// Regresaria las plantas guardadas para la greenhouse actual
app.get("/", async function (req, res) {
  var myplants = await MyPlant.find();
  res.render("index", { myplants });
});

app.get("/api/planttypes", async function (req, res) {
  var planttypes = await PlantType.find();
  return res.json(planttypes);
});


module.exports = app;
