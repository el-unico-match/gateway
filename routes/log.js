/*
    Rutas de Estado /log
    host + /api/log
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {
    getLogUser,
    getLog,
    getLogGateway
} = require('../controllers/log');

const router = Router();

/**
 * Log de usuario
*/
router.get('/user', getLogUser);

/**
 * Log del resto de microservicios
*/
router.get('/:service', validateJWT, getLog);

/**
 * Log del gateway
*/
router.get('/', validateJWT, getLogGateway);

module.exports = router;