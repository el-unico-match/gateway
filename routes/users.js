/*
    Rutas de Usuarios /users
    host + /api/users
*/

const {Router} = require('express');
const router = Router();
const {
    getDataUser,    
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    loginUser,
    revalidateToken,
    validateToken} = require('../controllers/users');
const {checkUserServiceIsActive} = require('../middlewares/checkers/users');

// Obtener datos del usuario
router.get('/current', checkUserServiceIsActive, getDataUser);

// Crear usuario
router.post('/edit', checkUserServiceIsActive, createUser);

// Actualizar usuario
router.put('/edit/:id', checkUserServiceIsActive, updateUser);

// Borrar usuario
router.delete('/edit/:id', checkUserServiceIsActive, deleteUser);

// Obtener usuarios
router.get('/info', checkUserServiceIsActive, getUsers);

// Login usuario
router.post('/login', checkUserServiceIsActive, loginUser);

// Revalidar token
router.post('/token', revalidateToken);

// Check token
router.get('/token', checkUserServiceIsActive, validateToken);

module.exports = router;
