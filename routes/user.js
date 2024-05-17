/*
    Rutas de Api /
    host + /api/user
*/

const {Router} = require('express');
const router = Router();
const {allApi} = require('../controllers/api');

/**
 * Única ruta para todos los request de la api
 */
router.all('/*', allApi);

module.exports = router;