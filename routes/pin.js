/*
    Rutas de Api /
    host + /api/pin
*/

const {Router} = require('express');
const router = Router();
const {pin} = require('../controllers/pin');

/**
 * Única ruta para todos los request de pin
 */
router.all('/*', pin);

module.exports = router;