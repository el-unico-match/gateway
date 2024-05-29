/*
    Rutas de Api /
    host + /api/user
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');

const router = Router();
router.use(validateJWT);

const {
    current, 
    user, 
    user_id, 
    user_id_match, 
    user_id_matchs, 
    user_match, 
    user_profile,
    match_filter,
} = require('../controllers/user');

/**
 * Ruta consulta matchs del servicio match
 */
router.all('/:id/matchs*', user_id_matchs);

/**
 * Ruta consulta matchs del servicio match
 */
router.all('/:id/match/*', user_id_match);

/**
 * Ruta consulta matchs del servicio match
 */
router.all('/match*', user_match);

/**
 * Ruta consulta profiles del servicio profile
 */
router.all('/profile*', user_profile);

/**
 * Ruta current del servicio usuarios
 */
router.all('/current', current);

/**
 * Ruta filtro de perfiles
 */
router.all('/:id/profiles/filter', match_filter);

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