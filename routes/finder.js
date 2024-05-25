/*
    Rutas de Api /
    host + /api/users
*/

const {Router} = require('express');
const getCandidates = require('../controllers/finder/getCandidates');

/**
 * @swagger
 * tags:
 *   - name: Finder
 *     description: API para hacer uso de la funcionalidad match finder.
 */ 
const router = Router();

/**
 * @swagger
 * /api/finder/candidates/:
 *   get:
 *     summary: Lista de candidatos
 *     description: Devuelve la lista de candidatos con su perfil completo
 *     parameters:
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
router.get('/candidates', getCandidates.validation, getCandidates.handler);

module.exports = router;