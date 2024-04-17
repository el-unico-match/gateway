/*
    Rutas de Servicios /services
    host + /api/services
*/

const {Router} = require('express');
const router = Router();
const {getServices} = require('../controllers/services');

// Obtener servicios
router.get('/', getServices);

module.exports = router;