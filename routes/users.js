/*
    Rutas de Usuarios /users
    host + /api/users
*/

const {Router} = require('express');
const router = Router();
const {
    start,
    stop,
    getService,
    getUsers,
    loginUser} = require('../controllers/users');
const {checkUserServiceIsActive} = require('../middlewares/checkers/users');

// Obtener estado del servicio usuarios
router.get('/status', getService);


// Obtener datos del usuario
//router.get('/current', checkUserServiceIsActive, getDataUser);

// Crear usuario
//router.post('/edit', checkUserServiceIsActive, createUser);

// Actualizar usuario
//router.put('/edit/:id', checkUserServiceIsActive, updateUser);

// Borrar usuario
//router.delete('/edit/:id', checkUserServiceIsActive, deleteUser);

// Obtener usuarios
//router.get('/info', checkUserServiceIsActive, getUsers);

// Login usuario
//router.post('/login', checkUserServiceIsActive, loginUser);

// Retornar estado del servicio
//router.get('/login', checkUserServiceIsActive, getStatus);

// Revalidar token
//router.post('/token', checkUserServiceIsActive, revalidateToken);

// Check token
//router.get('/token', checkUserServiceIsActive, validateToken);

module.exports = router;
