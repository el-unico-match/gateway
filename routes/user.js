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
router.all('/user', user);

/**
 * Única ruta para todos los request de la api
 */
router.all('/user/profile/*', user_profile);

module.exports = router;