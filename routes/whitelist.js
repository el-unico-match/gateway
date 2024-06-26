/*
    Rutas de Api /
    host + /api/pin
*/

const {Router} = require('express');
const router = Router();
const {whitelist} = require('../controllers/whitelist');

/**
 * Única ruta para todos los request de pin
 */
router.all('*', whitelist);

module.exports = router;