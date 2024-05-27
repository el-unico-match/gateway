const {getServiceStatus} = require('../servicesStatus/servicesStatus');
const TIMEOUT = 15000;

/**
 * 
 * @param {*} req 
 * @param {*} serviceName 
 * @returns 
 */
const parseRequest = (req, serviceName) => {
     
    const axiosConfig = {
        headers: {'x-token': req.header('x-token')},
        method: req.method,
        baseURL: getServiceStatus(serviceName).target + req.baseUrl.replace('/api',''),
        url: req.url,
        params: req.query,
        data: req.body,
        timeout: TIMEOUT,
    }

    return axiosConfig;
}

module.exports = {
    parseRequest
}
