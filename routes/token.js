/*
    Rutas de Api /
    host + /api/token
*/

const {Router} = require('express');
const {token} = require('../controllers/token');

const router = Router();

/**
 * Única ruta para todos los request de login
 */
router.all('/', token);

module.exports = router;