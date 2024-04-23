const {response} = require('express');
const axios = require('axios');
const {SERVICES} = require('../../types/services');
const {MSG_ERROR_WITH_SERVICE_REQUEST} = require('../../messages/services');
const {HTTP_SERVER_ERROR_5XX} = require('../../helpers/httpCodes')
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {processErrorAxiosRequest} = require('../../helpers/processErrorAxiosRequest');

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
        processErrorAxiosRequest(res, error);
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
        processErrorAxiosRequest(res, error);
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
        processErrorAxiosRequest(res, error);
    }
}

module.exports = {
    createUser,
    updateUser,
    deleteUser
}