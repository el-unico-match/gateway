const {parseRequest} = require('../helpers/requestHelper');
const axios = require('axios');
const { HTTP_SERVER_ERROR_5XX } = require('./httpCodes');
const {MSG_ERROR_WITH_SERVICE_REQUEST} = require('../messages/services');

const doRequestAxios =  async (req, res, microservice) => { 

    try {
        const axiosConfig = parseRequest(req, microservice);
        const {status, data} = await axios(axiosConfig);
        res.status(status).json(data);
    } catch (error) {
        const {code, response} = error;
        try {
            res.status(response.status).json(response.data);
        } catch (_error) {
            let axiosConfig = parseRequest(req, microservice);

            const errorDetail = code ? code : _error;
            const url = `${axiosConfig.baseURL}${axiosConfig.endpoint}`;
            console.log(`GATEWAY: On request to ${url}: ${errorDetail}`);
            
            res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE)
               .json({
                    ...axiosConfig,
                    ok: false,
                    msg: `${MSG_ERROR_WITH_SERVICE_REQUEST}: ${errorDetail}`,
                })
        }          
    }
}

/**
 * 
 * @returns El resultado del request pudiendo lanzar excepciones.
 */
const doGetAxios = async (baseURL, headers, body, params, endpoint) => {
    let instanceAxios = axios.create({
        baseURL: baseURL, 
        headers: headers,
        params: params,
        timeout: 4*TIMEOUT
    });
    return await instanceAxios.get(endpoint, body);
}

module.exports = {
    doRequestAxios,
    doGetAxios
}