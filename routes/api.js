/*
    Rutas de Api /
    host + /api
*/

const {Router} = require('express');
const router = Router();
const {allApi} = require('../controllers/api');

/**
 * Única ruta para todos los reques de la api
 */
router.all('/*', allApi);

module.exports = router;