const {response} = require('express');
const axios = require('axios');
const {SERVICES} = require('../../types/services');
const {MSG_ERROR_WITH_SERVICE_REQUEST} = require('../../messages/services');
const {HTTP_SERVER_ERROR_5XX} = require('../../helpers/httpCodes')
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');


/**
 * @returns Los usuarios registrados.
 */
const getUsers =  async (req, res = response) => {
    try {
        const token = req.header('x-token');
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        result = await instanceAxios.get('/info');
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
      //  processErrorAxiosRequest(res, error);
    }
}

module.exports = {getUsers}