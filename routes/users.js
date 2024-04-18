/*
    Rutas de Usuarios /auth
    host + /api/auth
*/

const {Router} = require('express');
const router = Router();
const {
    start,
    stop,
    getService,
    getUsers,
    loginUser} = require('../controllers/users');

// Obtener estado del servicio usuarios
router.get('/status', getService);

// Iniciar servicio usuarios
router.put('/start', start);

// Detener servicio usuarios
router.put('/stop', stop);

// Obtener usuarios
router.get('/', getUsers);

// Login usuario
router.post('/', loginUser);

module.exports = router;
