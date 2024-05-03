/*
    Rutas de Perfiles de un usuario /profiles/user
    host + /api/profiles/user/profile
*/

const {Router} = require('express');
const router = Router();
const {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile} = require('../../controllers/profiles/user_profile');

/**
 * @swagger
 * /api/profiles/user/profile/{id}:
 *  get:
 *      summary: get profile (aún no es funcional token, se puede poner cualquier cosa)
 *      tags: [Profile]
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *              type: string
 *              required: true
 *              description: user token
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          201: 
 *              description: return profile!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Profile'
 *          400:
 *              description: return error "info about requireds fields".
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          500:
 *              description: return internal error!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
*/
router.get('/:id', getUserProfile);

/**
 * @swagger
 * /api/profiles/user/profile:
 *  post:
 *      summary: creates profile (aún no es funcional token, se puede poner cualquier cosa)
 *      tags: [Profile]
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *              type: string
 *              required: true
 *              description: user token
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Profile'
 *      responses:
 *          201: 
 *              description: return profile!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Profile'
 *          400:
 *              description: return error "info about requireds fields".
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          500:
 *              description: return internal error!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
*/
router.post('/', createUserProfile);

/**
 * @swagger
 * /api/profiles/user/profile/{id}:
 *  put:
 *      summary: updates profile (aún no es funcional token, se puede poner cualquier cosa)
 *      tags: [Profile]
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *              type: string
 *              required: true
 *              description: user token
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Profile'
 *      responses:
 *          200: 
 *              description: return profile updated!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Profile'
 *          404:
 *              description: return error "user not exists".
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          422:
 *              description: return error "validation error".
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ValidationError'
 *          500:
 *              description: return internal error!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
*/
router.put('/:id', updateUserProfile);

/**
 * @swagger
 * /api/profiles/user/profile/{id}:
 *  delete:
 *      summary: deletes profile (aún no es funcional token, se puede poner cualquier cosa)
 *      tags: [Profile]
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *              type: string
 *              required: true
 *              description: user token
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200: 
 *              description: return profile updated!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Profile'
 *          404:
 *              description: return error "user not exists".
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          422:
 *              description: return error "validation error".
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ValidationError'
 *          500:
 *              description: return internal error!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
*/
router.delete('/:id', deleteUserProfile);

module.exports = router;