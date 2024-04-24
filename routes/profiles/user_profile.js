/*
    Rutas de Perfiles de un usuario /profiles/user
    host + /api/profiles/user
*/

const {Router} = require('express');
const router = Router();
const {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile} = require('../../controllers/profiles/user_profile');

// Obtener el perfil de un usuario
router.get('/:id', getUserProfile);

// Actualizar el perfil de un usuario
router.put('/:id', updateUserProfile);

// Borrar el perfil de un usuario
router.delete('/:id', deleteUserProfile);

module.exports = router;