/*
    Rutas de Api /
    host + /api/user
*/

const {Router} = require('express');
const router = Router();
const {current, user, user_id, user_profile} = require('../controllers/user');

/**
 * Ruta consulta profiles del servicio profile
 */
router.all('/profile*', user_profile);

/**
 * Ruta current del servicio usuarios
 */
router.all('/current', current);

/**
 * Ruta consulta usuarios
 */
router.all('/:id', user_id);

/**
 * Ruta consulta usuarios
 */
router.all('/', user);

//https://colaboratorio.net/x11tete11x/terminal/2017/como-comprobar-firmas-pgp-con-makepkg/
module.exports = router;