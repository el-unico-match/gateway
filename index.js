const express = require('express');
const cors = require('cors');

// Importar y configurar variables de entorno
require('dotenv').config();


// Paths
const path = require("path");

// Configuración Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Gateway API",
            version: "1.0.0"
        },
        servers: [
            {
                url: `https://gateway-uniquegroup-match-fiuba.azurewebsites.net`
            },
            {
                url: `http://localhost:${process.env.PORT}`
            }
        ]
    },
    apis: [
        `${path.join(__dirname, "./routes/*.*")}`,
        `${path.join(__dirname, "./routes/users/*.*")}`,
        `${path.join(__dirname, "./routes/profiles/*.*")}`,
    ]
}

// Crear servidor express
const app = express();

// CORS
app.use(cors());

// Directorio público
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Ruta Swagger
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))

// Rutas Servicios
app.use('/api/services', require('./routes/services'));

// Rutas Matches

// Rutas Messages

// Rutas Profiles
app.use('/api/profiles/user/profile', require('./routes/profiles/user_profile'));
// Rutas Usuarios
app.use('/api/users/current', require('./routes/users/current'));
app.use('/api/users/user', require('./routes/users/user'));
app.use('/api/users/users', require('./routes/users/users'));
app.use('/api/users/login', require('./routes/users/login'));
app.use('/api/users/token', require('./routes/users/token'));

// Escuchar peticiones
app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Api REST GATEWAY corriendo en ${process.env.HOST}:${process.env.PORT}`);
});
