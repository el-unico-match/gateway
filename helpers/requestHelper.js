const {getServiceStatus} = require('../servicesStatus/servicesStatus');
const TIMEOUT = 15000;

/**
 * 
 * @param {*} req 
 * @param {*} serviceName 
 * @param {*} newUrl : nuevo endpoint del servicio
 * @returns 
 */
const parseRequest = (req, serviceName, newUrl) => {
     
    const axiosConfig = {
        headers: {'x-token': req.header('x-token')},
        method: req.method,
        baseURL: getServiceStatus(serviceName).target + req.baseUrl.replace('/api',''),
        url: newUrl ? newUrl : req.url,
        params: req.query,
        data: req.body,
        timeout: TIMEOUT,
    }

    return axiosConfig;
}

module.exports = {
    parseRequest
}
