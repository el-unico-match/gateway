/*
    Rutas de Api /
    host + /api/user
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {matchapi} = require('../controllers/match');

const router = Router();
router.use(validateJWT);

/**
 * Ruta consulta matchs del servicio match
 */
router.all('*', matchapi);

module.exports = router;