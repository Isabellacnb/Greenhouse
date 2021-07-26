var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PlantTypeSchema = Schema({
    type: String,
    description: String,
    sunlight: String,
    water: String,
    daysToWater: Number,
    humidity: String,
    temperature: String,
    soil: String,
    problems: String,
    precautions: String,
    image: String,
    tips: String,
});

module.exports = mongoose.model("planttype", PlantTypeSchema);