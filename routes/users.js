/*
    Rutas de Api /
    host + /api/users
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {users, profiles} = require('../controllers/users');

const router = Router();

/**
 * Ruta para todos los request de users sobre servicio Profile
 */
router.all('/profiles', validateJWT, profiles);

/**
 * Ruta para todos los request de users sobre servicio User
 */
router.all('/', users);

module.exports = router;