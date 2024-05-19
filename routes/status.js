/*
    Ruta de obtención estado backend
    host + /status
*/

const {Router} = require('express');
const router = Router();
const {getStatus} = require('../controllers/status');

/**
 * @swagger
 * /status:
 *  get:
 *      summary: info about backend services
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
router.get('/', getStatus);

module.exports = router;