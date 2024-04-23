const {response} = require('express');
const axios = require('axios');
const {ROLES} = require('../types/role');
const {SERVICES} = require('../types/services');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {MSG_ERROR_WITH_SERVICE_REQUEST, MSG_SERVICE_DISABLED} = require('../messages/services');
const {HTTP_SERVER_ERROR_5XX, HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes')
const {getServiceStatus} = require('../servicesStatus/servicesStatus');

/**
 * 
 * @returns Los datos del usuario asociado el token del header.
 */
const getDataUser = async (req, res = response) => {
    try {
        const token = req.header('x-token');
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        let result = await instanceAxios.get('/current');
        try { 
            res.status(result.status).json(
                result.data
            )  
        } catch (error) {
            console.log(error);
            res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
                ok: false,
                msg: MSG_ERROR_WITH_SERVICE_REQUEST
            })    
        }
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

/**
 * @returns Los datos del usuarios creado.
 */
const createUser =  async (req, res = response) => {
    try {
        const token = req.header('x-token');
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        let result = await instanceAxios.post('/edit', req.body);
        try { 
            res.status(result.status).json(
                result.data
            )  
        } catch (error) {
            console.log(error);
            res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
                ok: false,
                msg: MSG_ERROR_WITH_SERVICE_REQUEST
            })    
        }
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

/**
 * @returns Los datos del usuarios actualizado.
 */
const updateUser =  async (req, res = response) => {
    try {
        const token = req.header('x-token');
        const userId = req.params.id;
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        let result = await instanceAxios.put('/edit/'+userId, req.body);
        try { 
            res.status(result.status).json(
                result.data
            )  
        } catch (error) {
            console.log(error);
            res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
                ok: false,
                msg: MSG_ERROR_WITH_SERVICE_REQUEST
            })    
        }
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

/**
 * @returns Informe de borrado.
 */
const deleteUser =  async (req, res = response) => {
    try {
        const token = req.header('x-token');
        const userId = req.params.id;
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        let result = await instanceAxios.delete('/edit/'+userId, req.body);
        try { 
            res.status(result.status).json(
                result.data
            )  
        } catch (error) {
            console.log(error);
            res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
                ok: false,
                msg: MSG_ERROR_WITH_SERVICE_REQUEST
            })    
        }
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

/**
 * @returns Los usuarios registrados.
 */
const getUsers =  async (req, res = response) => {
    try {
        const token = req.header('x-token');
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        let result = await instanceAxios.get('/info');
        try { 
            res.status(result.status).json(
                result.data
            )  
        } catch (error) {
            console.log(error);
            res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
                ok: false,
                msg: MSG_ERROR_WITH_SERVICE_REQUEST
            })    
        }
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

/**
 * @returns Los datos del usuarios logueado.
 */
const loginUser =  async (req, res = response) => {
    try {
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        let result = await instanceAxios.post('/login', req.body);
        if (checkAccess(result.data.role)) {
            try { 
                res.status(result.status).json(
                    result.data
                )  
            } catch (error) {
                console.log(error);
                res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
                    ok: false,
                    msg: MSG_ERROR_WITH_SERVICE_REQUEST
                })    
            }
        } else {
            res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json({
                ok: false,
                msg: MSG_SERVICE_DISABLED
            })
        }
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

/**
 * @returns Los datos del usuarios logueado.
 */
const revalidateToken =  async (req, res = response) => {
    try {
        const token = req.header('x-token');
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        let result = await instanceAxios.post('/token', req.body);
        if (checkAccess(result.data.role)) {
            try { 
                res.status(result.status).json(
                    result.data
                )  
            } catch (error) {
                console.log(error);
                res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
                    ok: false,
                    msg: MSG_ERROR_WITH_SERVICE_REQUEST
                })    
            }
        } else {
            res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json({
                ok: false,
                msg: MSG_SERVICE_DISABLED
            })
        }
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

/**
 * @returns Los datos del usuario correspondiente al token.
 */
const validateToken =  async (req, res = response) => {
    try {
        const token = req.header('x-token');
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        let result = await instanceAxios.get('/token');
        try { 
            res.status(result.status).json(
                result.data
            )  
        } catch (error) {
            console.log(error);
            res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
                ok: false,
                msg: MSG_ERROR_WITH_SERVICE_REQUEST
            })    
        }
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

/**
 * 
 * @param {*} role Role a checkear
 * @returns En caso que el servicio usuario se encuentre activo retorna verdadero.
 * Si esta inactivo retornada verdadero únicamente si el rol es administrador.
 */
const checkAccess = (role) => {
    if (!getServiceStatus(SERVICES.USERS).active) {
        return role === ROLES.ADMINISTRATOR
    }        
    return true;
}

module.exports = {
    getDataUser,
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    loginUser,
    revalidateToken,
    validateToken
}