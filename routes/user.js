/*
    Rutas de Api /
    host + /api/user
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');

const router = Router();

const {
    current, 
    user, 
    user_id, 
    user_id_match, 
    user_id_matchs, 
    user_match, 
    user_profile,
    get_user_profile_pictures,
    match_filter,
} = require('../controllers/user');

/**
 * Ruta consulta matchs del servicio match
 */
router.all('/:id/matchs*', validateJWT, user_id_matchs);

/**
 * Ruta consulta matchs del servicio match
 */
router.all('/:id/match/*', validateJWT, user_id_match);

/**
 * Ruta consulta matchs del servicio match
 */
router.all('/match/*', validateJWT, user_match);

/**
 * Retorna el perfil con las url de las imágenes
 */
router.get('/profile/:id', validateJWT, get_user_profile_pictures);

/**
 * Ruta consulta profiles del servicio profile
 */
router.all('/profile*', validateJWT, user_profile);

/**
 * Ruta current del servicio usuarios
 */
router.all('/current', current);

/**
 * Ruta filtro de perfiles
 */
router.all('/:id/profiles/filter', validateJWT, match_filter);

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