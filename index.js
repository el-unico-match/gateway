const express = require('express');
const cors = require('cors');

// Importar y configurar variables de entorno
require('dotenv').config();

// Crear servidor express
const app = express();

// CORS
app.use(cors());

// Directorio público
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/api/services', require('./routes/services'));
app.use('/api/users', require('./routes/users'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Api REST GATEWAY corriendo en el puerto ${process.env.PORT}`);
});