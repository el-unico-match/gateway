/*
    Rutas de Api /
    host + /api
*/

const {Router} = require('express');
const router = Router();
const {
    deleteApi,
    getApi,
    patchApi,
    postApi,
    putApi} = require('../controllers/api');


/**
 * @swagger
 * /api/:
 *  get:
 *      summary: api get
 *      response:
 *          500:
 *              description: return internal error!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: false
 *                              msg:
 *                                  type: string
 *                                  example: Please talk to the administrator
*/
router.get('/', getApi);

/**
 * @swagger
 * /api/:
 *  post:
 *      summary: api post
 *      response:
 *          500:
 *              description: return internal error!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: false
 *                              msg:
 *                                  type: string
 *                                  example: Please talk to the administrator
*/
router.post('/', postApi);

/**
 * @swagger
 * /api/:
 *  put:
 *      summary: api put
 *      responses:
 *          500:
 *              description: return internal error!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: false
 *                              msg:
 *                                  type: string
 *                                  example: Please talk to the administrator
*/
router.put('/:id', putApi);

/**
 * @swagger
 * /api/:
 *  patch:
 *      summary: api patch
 *      responses:
 *          500:
 *              description: return internal error!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: false
 *                              msg:
 *                                  type: string
 *                                  example: Please talk to the administrator
*/
router.patch('/:id', patchApi);

/**
 * @swagger
 * /api/:
 *  delete:
 *      summary: delete request
 *      responses:
 *          500:
 *              description: return internal error!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: false
 *                              msg:
 *                                  type: string
 *                                  example: Please talk to the administrator
*/
router.delete('/', deleteApi);

module.exports = router;