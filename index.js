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

// Rutas Servicios
app.use('/api/services', require('./routes/services'));

// Rutas Matches

// Rutas Messages

// Rutas Profiles
app.use('/api/profiles/user/profile', require('./routes/profiles/user_profile'));
// Rutas Usuarios
app.use('/api/users/current', require('./routes/users/current'));
app.use('/api/users/edit', require('./routes/users/edit'));
app.use('/api/users/info', require('./routes/users/info'));
app.use('/api/users/login', require('./routes/users/login'));
app.use('/api/users/token', require('./routes/users/token'));

// Escuchar peticiones
app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Api REST GATEWAY corriendo en ${process.env.HOST}:${process.env.PORT}`);
});
