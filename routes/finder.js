/*
    Rutas de Api /
    host + /api/users
*/
const {Router} = require('express');
const getCandidates = require('../controllers/finder/getCandidates');
const getCrushes = require('../controllers/finder/getCrushes');
const getLikes = require('../controllers/finder/getLikes');
const {validateJWT} = require('../middlewares/validateJWT');

/**
 * @swagger
 * tags:
 *   - name: Finder
 *     description: API para hacer uso de la funcionalidad match finder.
 */ 
const router = Router();
router.use(validateJWT);

/**
 * @swagger
 * /api/finder/candidates/:
 *   get:
 *     summary: Lista de candidatos
 *     description: Devuelve la lista de candidatos con su perfil completo      
 *     parameters:
 *       - in: header
 *         name: x-token
 *         description: The user active JWT token
 *         schema:
 *          type: string
 *          format: JWT
 *         required: true
 *       - in: query
 *         name: profileId
 *         description: The user profile identifier
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: gender
 *         description: 
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: age
 *         description: 
 *         schema:
 *           type: int
 *         required: false
 *       - in: query
 *         name: education
 *         description: 
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: ethniticity
 *         description: 
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: pageSize
 *         description: The amount of candidates to retrieve per request.
 *         schema:
 *           type: int
 *         required: false
 *       - in: query
 *         name: pageNumber
 *         description: On paged requests, the number of the page being retrieved.
 *         schema:
 *           type: int
 *         required: false
 *     tags: [Finder]
 *     responses:
 *       200:
 *         description: Una lista de candidatos
 */

router.get('/candidates', getCandidates.handler);

/**
 * @swagger
 * /api/finder/crushes/:
 *   get:
 *     summary: Lista de crushes
 *     description: Devuelve la lista de crushes      
 *     parameters:
 *       - in: header
 *         name: x-token
 *         description: The user active JWT token
 *         schema:
 *          type: string
 *          format: JWT
 *         required: true
 *       - in: query
 *         name: profileId
 *         description: The user profile identifier
 *         schema:
 *           type: string
 *         required: true
 *     tags: [Finder]
 *     responses:
 *       200:
 *         description: Una lista de candidatos
 */

router.get('/crushes', getCrushes.handler);


/**
 * @swagger
 * /api/finder/likes/:
 *   get:
 *     summary: Lista de Like
 *     description: Devuelve la lista de Like      
 *     parameters:
 *       - in: header
 *         name: x-token
 *         description: The user active JWT token
 *         schema:
 *          type: string
 *          format: JWT
 *         required: true
 *       - in: query
 *         name: profileId
 *         description: The user profile identifier
 *         schema:
 *           type: string
 *         required: true
 *     tags: [Finder]
 *     responses:
 *       200:
 *         description: Una lista de candidatos
 */

router.get('/likes', getLikes.handler);


module.exports = router;