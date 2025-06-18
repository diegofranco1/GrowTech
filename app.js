require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors()); 
app.use(express.json()); 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB Atlas "))
  .catch(err => console.error("Error de conexión :", err));
app.get('/', (req, res) => {
  res.send("¡Backend funcionando!");
});
const sensorRoutes = require('./routes/sensorRoutes');
app.use('/api/sensors', sensorRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT} 🚀`);
});