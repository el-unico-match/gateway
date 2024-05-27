/*
    Rutas de Servicios 
    host + /api/services
*/

const {Router} = require('express');
const {services} = require('../controllers/services');
const {validateJWT} = require('../middlewares/validateJWT');

const router = Router();
router.use(validateJWT);

/**
 * Ruta única para el servicio Services
 */
router.get('/', services);

module.exports = router;