/*
    Rutas de Api /
    host + /api/users
*/
const {Router} = require('express');
const getCandidates = require('../controllers/finder/getCandidates');
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

router.get('/candidates', getCandidates.requestValidation, getCandidates.handler);

module.exports = router;