/*
    Rutas de Perfiles de un usuario /profiles/users/profiles
    host + /api/profiles/users/profiles
*/

const {Router} = require('express');
const router = Router();
const {getUsersProfiles} = require('../../controllers/profiles/users_profiles');

/**
 * @swagger
 * /api/profiles/users/profiles:
 *  get:
 *      summary: get all the users profiles (aún no es funcional token, se puede poner cualquier cosa)
 *      tags: [Profile]
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *              type: string
 *              required: true
 *              description: user token
 *      responses:
 *          200: 
 *              description: return all the users profiles!
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
 *                                      $ref: '#/components/schemas/Profile'
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
router.get('/', getUsersProfiles);

module.exports = router;