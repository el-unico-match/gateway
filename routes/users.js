/*
    Rutas de Usuarios /users
    host + /api/users
*/

const {Router} = require('express');
const router = Router();
const {
    start,
    stop} = require('../controllers/users');

// Iniciar servicio usuarios
router.put('/start', start);

// Detener servicio usuarios
router.put('/stop', stop);

module.exports = router;
