/*
    Rutas de Api /
    host + /api/token
*/

const {Router} = require('express');
const router = Router();
const {token} = require('../controllers/token');

/**
 * Única ruta para todos los request de login
 */
router.all('/', token);

module.exports = router;