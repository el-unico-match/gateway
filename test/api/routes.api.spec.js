const request = require('supertest');
const express = require('express');
require('dotenv').config();
const {initLog} = require('../../helpers/log/log');
//inicializar log
initLog();

describe('Pruebas sobre la API', () => {
    const MAX_TIME_OUT = 40000;
    test('La ruta funciona', async () => {
        process.env.PORT ||= 4001;
        process.env.MATCHES_API_DOMAIN ||= "https://match-api-uniquegroup-match-fiuba.azurewebsites.net"; 
        process.env.MESSAGES_API_DOMAIN ||= "https://messages-uniquegroup-match-fiuba.azurewebsites.net";
        process.env.PROFILES_API_DOMAIN ||= "https://profile-uniquegroup-match-fiuba.azurewebsites.net";
        process.env.SERVICES_API_DOMAIN ||= "https://services-uniquegroup-match-fiuba.azurewebsites.net/";
        process.env.USERS_API_DOMAIN ||= "https://users-uniquegroup-match-fiuba.azurewebsites.net/api";
        process.env.HOST ||= "0.0.0.0";
        // Crear servidor express
        app = express();
        // Lectura y parseo del body
        app.use(express.json());
        // Rutas Api
        app.use('/status', require('../../routes/status'));    
        const response = await request(app).get('/status');
        expect(response.headers['content-type']).toContain('json');
        //expect(response.status).toBe(200);
    }, MAX_TIME_OUT);
});