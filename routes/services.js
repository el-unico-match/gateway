/*
    Rutas de Servicios 
    host + /api/services
*/

const {Router} = require('express');
const router = Router();
const {services} = require('../controllers/services');

/**
 * Ruta única para el servicio Services
 */
router.get('/', services);

module.exports = router;