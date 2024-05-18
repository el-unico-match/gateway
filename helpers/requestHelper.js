const {getServiceStatus} = require('../servicesStatus/servicesStatus');

/**
 * 
 * @param {*} req 
 * @param {*} serviceName 
 * @param {*} prefix example user
 * @param {*} endpointFilter 
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
    return {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    }
}

const getService = (req) => {
    try {
        const originalUrl = req.originalUrl;
        const splited = originalUrl.split('/');
        return splited[2]    
    } catch (error) {
        return;   
    }
}

const getEndpoint = (req, prefix, endpointFilter) => {
    const path = req._parsedUrl.path;
    console.log(path);
    /*
    if (serviceName) {
        return path.slice(serviceName.length+1);
    }*/
}

module.exports = {
    parseRequest
}
