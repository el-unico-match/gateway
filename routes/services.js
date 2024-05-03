/*
    Rutas de Servicios /services
    host + /api/services
*/

const {Router} = require('express');
const router = Router();
const {getServices} = require('../controllers/services');

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

module.exports = router;