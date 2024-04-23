/*
    Rutas de Usuarios /users/login
    host + /api/users/login
*/

const {Router} = require('express');
const router = Router();
const {loginUser} = require('../../controllers/users/login');
const {checkUserServiceIsActive} = require('../../middlewares/checkers/users');

// Login usuario
router.post('/', checkUserServiceIsActive, loginUser);

module.exports = router;
