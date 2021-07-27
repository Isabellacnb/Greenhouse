const express = require("express");
const app = express();

const MyPlant = require("../model/myplant");
const PlantType = require("../model/planttype");

// Function to format date
function formatDate(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();

  var mmChars = mm.split('');
  var ddChars = dd.split('');
  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);

}

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

// Water your plant
app.post("/water/:id", async (req, res) => {
  var id = req.params.id;
  console.log(id);
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
  console.log(date);
  res.render("editplant", {myplant, planttypes, date});
});

app.post("/edit/:id", async (req, res) => {
  var id = req.params.id;
  await MyPlant.updateOne({ _id: id }, req.body);
  res.redirect(`/plantinfo/${id}`);
});

// Regresaria las plantas guardadas para la greenhouse actual
app.get("/", async (req, res) => {
  var myplants = await MyPlant.find();
  var planttypes = await PlantType.find();
  res.render("index", { myplants, planttypes });
});

app.get("/api/planttypes", async (req, res) => {
  var planttypes = await PlantType.find();
  return res.json(planttypes);
});



module.exports = app;
