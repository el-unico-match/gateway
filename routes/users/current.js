/*
    Rutas de Usuarios /users/current
    host + /api/users/current
*/

const {Router} = require('express');
const router = Router();
const {getDataUser} = require('../../controllers/users/current');
const {checkUserServiceIsActive} = require('../../middlewares/checkers/users');

// Obtener datos del usuario
router.get('/', checkUserServiceIsActive, getDataUser);

module.exports = router;
