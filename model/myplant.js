var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MyPlantSchema = Schema({
    name: String,
    location: String,
    type: String,
    dateLastWatered: Date,
});

module.exports = mongoose.model("myplant", MyPlantSchema);