const express = require('express');
const { initializePrometheus } = require('./middlewares/prometheus');
const cors = require('cors');
const {
    initLog,
    logInfo} = require('./helpers/log/log');

// Importar y configurar variables de entorno
require('dotenv').config();
const {setApikeys, setSelfApikey, setActiveApiKeyEndpoint, enableApiKey} = require('./helpers/apikeys')
setApikeys(process.env.APIKEY_WHITELIST.split(' '));
setSelfApikey(process.env.APIKEY_VALUE);
setActiveApiKeyEndpoint(process.env.APIKEY_ACTIVATE_ENDPOINT);
enableApiKey();

// Inicializar log
initLog();

// Paths
const path = require("path");

// Configuración Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const {errorHandlerMiddleware} = require('./middlewares/errorHandlerMiddleware');
const fs = require('fs');

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
};

// Crear servidor express
const app = express();

// CORS
app.use(cors());

// Directorio público
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

const customCss = fs.existsSync(__dirname + `/swagger-theme.css`) ? fs.readFileSync(__dirname + `/swagger-theme.css`, 'utf8') : '';

// Ruta Swagger
const options = {
    explorer: true,
    customCss: customCss,
};

logInfo(`Swagger initialized: ${JSON.stringify(swaggerSpec.definition)}`);

app.use(["/api-doc","/api-docs"], swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec),options))

initializePrometheus(app);

// Rutas Status Servicios
app.use('/status', require('./routes/status'));

// Rutas Api
app.use('/api/login', require('./routes/login'));
app.use('/api/services', require('./routes/services'));
app.use('/api/token', require('./routes/token'));
app.use('/api/user', require('./routes/user'));
app.use('/api/users', require('./routes/users'));
app.use('/api/finder', require('./routes/finder'));
app.use('/api/match', require('./routes/match'));
app.use('/api/restorer', require('./routes/restorer'));
app.use('/api/pin', require('./routes/pin'));
app.use('/whitelist', require('./routes/whitelist'));

// Ruta log
app.use('/api/log', require('./routes/log'));

// Escuchar peticiones
app.listen(process.env.PORT, process.env.HOST, () => {
    logInfo(`Api GATEWAY running on ${process.env.HOST}:${process.env.PORT}`);
});

// errorHandlerMiddleware
app.use(errorHandlerMiddleware)