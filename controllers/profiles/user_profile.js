const {response} = require('express');
const axios = require('axios');
const {SERVICES} = require('../../types/services');
const {MSG_ERROR_WITH_SERVICE_REQUEST} = require('../../messages/services');
const {
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SERVER_ERROR_5XX} = require('../../helpers/httpCodes')
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {
    checkAccessOwnershipBased,
    checkAccessValidToken} = require('../../helpers/validateAccess');
const {MSG_ACCESS_DENIED} = require('../../messages/services');

/**
 * 
 * @returns El perfil del usuario asociado al id.
 */
const getUserProfile = async (req, res = response) => {
    try {
        if (checkAccessValidToken) {
            const token = req.header('x-token');
            let url = getServiceStatus(SERVICES.USERS).target;
            const instanceAxios = axios.create({baseURL: url});
            instanceAxios.defaults.headers.common['x-token'] = token;
            let result = await instanceAxios.get('/user/profile');
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
            return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
                ok:false,
                msg: MSG_ACCESS_DENIED
            });
        }
    } catch (error) {
    
    }
}

/**
 * @returns Los datos del usuarios actualizado.
 */
const updateUserProfile =  async (req, res = response) => {
    try {
        const userId = req.params.id;
        if (checkAccessOwnershipBased(req, userId)) {
            let url = getServiceStatus(SERVICES.USERS).target;
            const instanceAxios = axios.create({baseURL: url});
            let result = await instanceAxios.put('/user/profile'+userId, req.body);
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
            return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
                ok:false,
                msg: MSG_ACCESS_DENIED
            });
        }
    } catch (error) {

    }
}

/**
 * @returns Informe de borrado.
 */
const deleteUserProfile =  async (req, res = response) => {
    try {
        const userId = req.params.id;
        if (checkAccessOwnershipBased(req, userId)) {
            let url = getServiceStatus(SERVICES.USERS).target;
            const instanceAxios = axios.create({baseURL: url});
            let result = await instanceAxios.delete('/user/profile'+userId, req.body);
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
            return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
                ok:false,
                msg: MSG_ACCESS_DENIED
            });
        }
    } catch (error) {
  
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}