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

module.exports = {
    parseRequest
}
