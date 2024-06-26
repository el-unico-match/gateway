const {getServiceStatus} = require('../servicesStatus/servicesStatus');
const {getSelfApikey} = require('../helpers/apikeys');
const { head } = require('../routes/apikeys');
const TIMEOUT = 120000;

/**
 * 
 * @param {*} req 
 * @param {*} serviceName 
 * @param {*} newUrl : nuevo endpoint del servicio
 * @returns 
 */
const parseRequest = (req, serviceName, newUrl) => {
     
    const apiKey = getSelfApikey();

    headers = {'x-token': req.header('x-token')};
    if (apiKey != '') {
        headers['x-apikey'] = apiKey;
    }

    const axiosConfig = {
        headers: headers,
        method: req.method,
        baseURL: getServiceStatus(serviceName).target + req.baseUrl.replace('/api',''),
        url: newUrl ? newUrl : req.url != '/' ? req.url : undefined,
        params: req.query,
        data: req.body,
        timeout: TIMEOUT,
    }

    return axiosConfig;
}


const parseHeaders = (req) => {
    let x_token = req.header('x-token');
    let x_apikey = req.header('x-apikey')
    let response = {}
    if (x_token) {
        response = {'x-token': x_token};
    }
    if (x_apikey) {
        response = {
            'x-apikey': x_apikey,
            ...retorno
        }
    }
    return response;
}

module.exports = {
    parseRequest,
    parseHeaders
}
