const {isService} = require('../types/services');
const {getServiceStatus} = require('../servicesStatus/servicesStatus');

const parseRequest = (req) => {
    const method = req.method;
    const headers = {
        'x-token': req.header('x-token')
    };
    const body = req.body;
    const params = req.params;
    const service = getService(req);
    const endpoint = getEndpoint(req, service);
    let url;
    if (isService(service)) {
        url = getServiceStatus(service).target;
    }
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

const getEndpoint = (req, serviceName) => {
    const path = req._parsedUrl.path;
    if (serviceName) {
        return path.slice(serviceName.length+1);
    }
}

module.exports = {
    parseRequest
}
