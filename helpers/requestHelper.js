const {getServiceStatus} = require('../servicesStatus/servicesStatus');

/**
 * 
 * @param {*} req 
 * @param {*} serviceName 
 * @param {*} prefix example "user/" or ""
 * @param {*} endpointFilter example "api/user/" or ""
 * @returns 
 */
const parseRequest = (req, serviceName, prefix, endpointFilter) => {
    const method = req.method;
    const headers = {
        'x-token': req.header('x-token')
    };
    const body = req.body;
    const params = req.params;
    const endpoint = getEndpoint(req, prefix, endpointFilter);
    let url = getServiceStatus(serviceName).target;
    console.log(url);
    console.log(endpoint);
    return {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    }
}

const getEndpoint = (req, prefix, endpointFilter) => {
    const splitted = req.originalUrl.split(endpointFilter)[1];
    if (splitted) {
        return `/${prefix}${splitted}`;    
    } else {
        return `/${prefix}`;
    }    
}

module.exports = {
    parseRequest
}
