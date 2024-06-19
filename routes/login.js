/*
    Rutas de Api /
    host + /api/login
*/

const {Router} = require('express');
const router = Router();
const {login} = require('../controllers/login');

/**
 * Única ruta para todos los request de login
 */
router.all('/', login);

module.exports = router;