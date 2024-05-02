/*
    Rutas de Usuarios /users/user
    host + /api/users/users
*/

const {Router} = require('express');
const router = Router();
const {getUsers} = require('../../controllers/users/users');
const {checkUserServiceIsActive} = require('../../middlewares/checkers/users');

/**
 * @swagger
 * /api/users/users:
 *  get:
 *      summary: get all the users
 *      tags: [User]
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *              type: string
 *              required: true
 *              description: user token
 *      responses:
 *          200: 
 *              description: return all the users!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: true
 *                              users:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      $ref: '#/components/schemas/UserSharedData'
 *          400:
 *              description: return error "There is no token in the request"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: false
 *                              msg:
 *                                  type: object
 *                                  example: There is no token in the request
 *          401:
 *              description: return error "Invalid token"!
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
 *                                  example: Invalid token
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
router.get('/', checkUserServiceIsActive, getUsers);

module.exports = router;