/*
    Rutas de Api /
    host + /api/users
*/

const {Router} = require('express');
const router = Router();
const {users, profiles} = require('../controllers/users');

/**
 * Ruta para todos los request de users sobre servicio Profile
 */
router.all('/profiles', profiles);

/**
 * Ruta para todos los request de users sobre servicio User
 */
router.all('/', users);

module.exports = router;