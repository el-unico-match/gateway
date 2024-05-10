/*
    Rutas de Servicios /services
    host + /services
*/

const {Router} = require('express');
const router = Router();
const {getServices} = require('../controllers/services');

/**
 * @swagger
 * /services:
 *  get:
 *      summary: info about services
 *      responses:
 *          200: 
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