const {parseRequest} = require('../helpers/requestHelper');
const axios = require('axios');
const {MSG_ERROR_WITH_SERVICE_REQUEST} = require('../messages/services');
const MAX_RETRY_ATTEMPTS = 3;
const MS = 1000;
const MUTIPLIER = 2;
const TIMEOUT = 10000;

const handleAxiosRequestConfig = async (axiosConfig, retryAttempt) => { 

    try {
        return await axios(axiosConfig);
    } 
    
    catch (error) {

        // if ((error?.code === 'ECONNREFUSED' || error?.response?.status == axios.HttpStatusCode.ServiceUnavailable) && retryAttempt < MAX_RETRY_ATTEMPTS) {
        //     retryAttempt++;
        //     console.log(`Retry attempt #${retryAttempt} because server was unavailable`);
            
        //     const delay = retryAttempt * MUTIPLIER * MS;
        //     await new Promise(r => setTimeout(r, delay));

        //     return await axios(axiosConfig);
        // }

        const serviceRetunedStatus = error?.response?.status;

        if ( serviceRetunedStatus !== undefined ) {

            return {
                status: serviceRetunedStatus, 
                data: error?.response?.data,
            };
        }

        try {
            const status = error?.code === 'ECONNREFUSED' ? axios.HttpStatusCode.ServiceUnavailable : axios.HttpStatusCode.InternalServerError;

            const data = {
                ok: false,
                req: {...axiosConfig},
                msg: MSG_ERROR_WITH_SERVICE_REQUEST,
            }
    
            return { status, data }
        }

        catch (_error) {
            const url = `${req.baseUrl}${req.url}`;
            const errorDetail = error.code ? error.code : _error;
            console.log(`GATEWAY: On request to ${url}: ${errorDetail}`);

            const data = {
                ok: false,
                msg: `${MSG_ERROR_WITH_SERVICE_REQUEST}: ${errorDetail}`,
            }

            return { status: axios.HttpStatusCode.InternalServerError, data }
        }
    }
}

const sendRequestAxios = async (req, res, microservice, newUrl) => { 
    const axiosConfig = parseRequest(req, microservice, newUrl);
    return await handleAxiosRequestConfig(axiosConfig, res, 0);
}

const doRequestAxios = async (req, res, microservice, newUrl) => { 
    const {status, data} = await sendRequestAxios(req, res, microservice, newUrl);
    res.status(status).json(data);
}

/**
 * 
 * @param {*} next : (req, res, status1, data1) => (status, data)
 */
const doChainRequestAxios = async (req, res, microservice, newUrl, next) => { 
    const {status: status1, data: data1} = await sendRequestAxios(req, res, microservice, newUrl);
    const {data, status} = await next(req, res, data1, status1);
    res.status(status).json(data);
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
        timeout: TIMEOUT
    });
    return await instanceAxios.get(endpoint, body);
}

module.exports = {
    handleAxiosRequestConfig,
    doRequestAxios,
    doChainRequestAxios,
    sendRequestAxios,
    doGetAxios
}