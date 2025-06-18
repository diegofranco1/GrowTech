const EnvironmentalData = require('../models/EnvironmentalData');

exports.saveData = async (req, res) => {
  try {
    const { uvIndex, temperature, soilHumidity, color } = req.body;
    
    const newData = new EnvironmentalData({
      uvIndex,
      temperature,
      soilHumidity,
      color
    });

    await newData.save();
    res.status(201).json({ success: true, message: "Datos guardados" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getLatestData = async (req, res) => {
  try {
    const data = await EnvironmentalData.findOne()
      .sort({ timestamp: -1 }); 
    if (!data) {
      return res.status(404).json({ success: false, error: "No hay datos" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al leer datos" });
  }
};