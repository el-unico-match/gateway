/*
    Rutas de Usuarios /users/edit
    host + /api/users/edit
*/

const {Router} = require('express');
const router = Router();
const {
    createUser,
    updateUser,
    deleteUser} = require('../../controllers/users/edit');
const {checkUserServiceIsActive} = require('../../middlewares/checkers/users');

// Crear usuario
router.post('/', checkUserServiceIsActive, createUser);

// Actualizar usuario
router.put('/:id', checkUserServiceIsActive, updateUser);

// Borrar usuario
router.delete('/:id', checkUserServiceIsActive, deleteUser);

module.exports = router;