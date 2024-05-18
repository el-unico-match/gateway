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
        `${path.join(__dirname, "./doc/*.*")}`
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

// Rutas Servicios Provisoria
app.use('/services', require('./routes/services'));

// Rutas Api
//--app.use('/api/', require('./routes/api'));
app.use('/api/login', require('./routes/login'));
//app.use('/api/services', require('./routes/services'));
//app.use('/api/token', require('./routes/token'));
//app.use('/api/user', require('./routes/user'));
//app.use('/api/users', require('./routes/users'));

// Escuchar peticiones
app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Api REST GATEWAY corriendo en ${process.env.HOST}:${process.env.PORT}`);
});
