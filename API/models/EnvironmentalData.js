const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  uvIndex: { type: Number, required: true }, 
  temperature: { type: Number, required: true },
  soilHumidity: { type: Number, required: true }, 
  color: {
    light: { type: Number }, 
    red: { type: Number },    
    green: { type: Number },
    blue: { type: Number }
  },
  timestamp: { type: Date, default: Date.now, index: true }
}, { versionKey: false });

module.exports = mongoose.model('EnvironmentalData', sensorSchema);