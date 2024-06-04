/*
    Rutas de Api /
    host + /api/user
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {matchapi} = require('../controllers/match');

const router = Router();
router.use(validateJWT);

/**
 * @swagger
 * /api/match/swipes/:
 *   get:
 *     summary: Lista de swipes dados
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
 *         name: swiper_id
 *         description: The id of the user being searched
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: swiper_name 
 *         description: The name or part of the name of one of either the qualificated or qualificator.
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: superlikes
 *         description: True if retrieved swipes should contain superlikes 
 *         schema:
 *           type: bool
 *         required: false
 *       - in: query
 *         name: matchs
 *         description: True if retrieved swipes should contain only matchs 
 *         schema:
 *           type: bool
 *         required: false
 *       - in: query
 *         name: likes
 *         description: True if retrieved swiped should not be matchs and only not matched ones 
 *         schema:
 *           type: bool
 *         required: false
 *       - in: query
 *         name: blocked
 *         description: True if retrieved swipes should contain blocked matches, False if shouldn't be returned.
 *         schema:
 *           type: bool
 *         required: false
 *     tags: [Match]
 *     responses:
 *       200:
 *         description: Devuele un array vacío si no encuentra resultados o con los swipes que satisfacen las condiciones.
 */
router.all('*', matchapi);

module.exports = router;