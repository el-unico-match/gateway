/*
    Rutas de Usuarios /users/token
    host + /api/users/token
*/

const {Router} = require('express');
const router = Router();
const {
    revalidateToken,
    validateToken} = require('../../controllers/users/token');
const {checkUserServiceIsActive} = require('../../middlewares/checkers/users');

// Revalidar token
router.post('/', revalidateToken);

// Check token
router.get('/', checkUserServiceIsActive, validateToken);

module.exports = router;
