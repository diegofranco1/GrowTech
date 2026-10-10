require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

for (const name of ['MONGODB_URI', 'API_KEY', 'JWT_SECRET']) {
  if (!process.env[name]) {
    throw new Error(`Falta configurar ${name} en el entorno del servidor.`);
  }
}

if (process.env.API_KEY.length < 32) {
  throw new Error('API_KEY debe tener al menos 32 caracteres.');
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres.');
}

app.use(cors());
app.use(express.json({ limit: '16kb' }));
app.get('/', (req, res) => {
  res.send("¡Backend funcionando!");
});
const sensorRoutes = require('./routes/sensorRoutes');
app.use('/api/sensors', sensorRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo conectar a MongoDB:', error);
    process.exitCode = 1;
  });