/*
    Rutas de Usuarios /users/info
    host + /api/users/info
*/

const {Router} = require('express');
const router = Router();
const {getUsers} = require('../../controllers/users/info');
const {checkUserServiceIsActive} = require('../../middlewares/checkers/users');

// Obtener usuarios
router.get('/', checkUserServiceIsActive, getUsers);

module.exports = router;