/*
    Rutas de Servicios /services
    host + /api/services
*/

const {Router} = require('express');
const router = Router();
const {
    getServices,
    updateServiceStatus} = require('../controllers/services');
const {checkUpdateServiceStatus} = require('../middlewares/checkers/services')

// Obtener información acerca de los servicios
router.get('/', getServices);

// Iniciar o detener un servicio
router.put('/', checkUpdateServiceStatus, updateServiceStatus);

module.exports = router;