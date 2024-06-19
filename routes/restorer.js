/*
    Rutas de Api /
    host + /api/restorer
*/

const {Router} = require('express');
const router = Router();
const {restorer} = require('../controllers/restorer');

/**
 * Única ruta para todos los request de restorer
 */
router.all('/*', restorer);

module.exports = router;