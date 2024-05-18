/*
    Rutas de Api /
    host + /api/user
*/

const {Router} = require('express');
const router = Router();
const {user, user_profile} = require('../controllers/user');

/**
 * Única ruta para todos los request de la api
 */
router.all('/profile/*', user_profile);

/**
 * Única ruta para todos los request de la api
 */
router.all('/', user);

module.exports = router;