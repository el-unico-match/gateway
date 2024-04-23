const {response} = require('express');
const axios = require('axios');
const {ROLES} = require('../../types/role');
const {SERVICES} = require('../../types/services');
const {MSG_ERROR_WITH_SERVICE_REQUEST, MSG_SERVICE_DISABLED} = require('../../messages/services');
const {HTTP_SERVER_ERROR_5XX} = require('../../helpers/httpCodes')
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {processErrorAxiosRequest} = require('../../helpers/processErrorAxiosRequest');

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
        processErrorAxiosRequest(res, error);
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

module.exports = {loginUser}