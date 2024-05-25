/*
    Rutas de Api /
    host + /api/users
*/

const {Router} = require('express');
const router = Router();
const getCandidates = require('../controllers/finder/getCandidates');

router.get('/candidates', getCandidates.validation, getCandidates.handler);


module.exports = router;