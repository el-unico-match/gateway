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

/**
 * @swagger
 * /api/services:
 *  get:
 *      summary: info about services
 *      responses:
 *          202: 
 *              description: services status!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: true
 *                              services:
 *                                  type: object
 *                                  $ref: '#/components/schemas/ServicesStatus'
*/
router.get('/', getServices);

// Iniciar o detener un servicio
router.put('/', checkUpdateServiceStatus, updateServiceStatus);

module.exports = router;