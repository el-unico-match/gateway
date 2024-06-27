const {parseRequest} = require('../helpers/requestHelper');
const axios = require('axios');
const {MSG_NO_APIKEY, MSG_INVALID_APIKEY} = require('../messages/apikey')
const {doValidateApikey} = require('../middlewares/validateApikeys')
const {getSelfApikey, isApiKeyCheckingEnabled} = require('../helpers/apikeys')
const {MSG_ERROR_WITH_SERVICE_REQUEST} = require('../messages/services');
const TIMEOUT = 10000;
const {
    logInfo,
    logWarning,
    logDebug} = require('./log/log');
const { HTTP_CLIENT_ERROR_4XX, HTTP_SERVER_ERROR_5XX } = require('./httpCodes');

const handleAxiosRequestConfig = async (axiosConfig, retryAttempt) => { 

    try {
        return await axios(axiosConfig);
    } 
    
    catch (error) {

        const serviceRetunedStatus = error?.response?.status;

        if ( serviceRetunedStatus !== undefined ) {
            const dataToResponse = error?.response?.data;
            logWarning(`On handle axios request: ${JSON.stringify(dataToResponse)}`)
            return {
                status: serviceRetunedStatus, 
                data: dataToResponse,
            };
        }

        try {
            const status = error?.code === 'ECONNREFUSED' ? axios.HttpStatusCode.ServiceUnavailable : axios.HttpStatusCode.InternalServerError;
            
            const data = {
                ok: false,
                req: {...axiosConfig},
                msg: MSG_ERROR_WITH_SERVICE_REQUEST,
            }
            logWarning(`On handle axios request, error: ${status} ${JSON.stringify(data)}`)
            return { status, data }
        }

        catch (_error) {
            const url = `${req.baseUrl}${req.url}`;
            const errorDetail = error.code ? error.code : _error;
            logWarning(`On request to ${url}: ${JSON.stringify(errorDetail)}`);

            const data = {
                ok: false,
                msg: `${MSG_ERROR_WITH_SERVICE_REQUEST}: ${errorDetail}`,
            }

            return { status: axios.HttpStatusCode.InternalServerError, data }
        }
    }
}

const checkIfGatewayApiKeyIsActive = (res, status, json) => {

    const checkSelfApiKey = isApiKeyCheckingEnabled();

    gatewayApiKey = getSelfApikey();

    if (checkSelfApiKey && gatewayApiKey == null)
    {
        return res
            .status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST)
            .json({ok: 'false', msg: MSG_NO_APIKEY});
    }

    try {
        if (checkSelfApiKey) {
            doValidateApikey(gatewayApiKey);
        }

        return res.status(status).json(json);
    }

    catch(exception) 
    {
        return res
            .status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE)
            .json({ok: 'false', msg: MSG_INVALID_APIKEY});
    }
}

const sendRequestAxios = async (req, res, microservice, newUrl) => { 

    const checkSelfApiKey = isApiKeyCheckingEnabled();

    gatewayApiKey = getSelfApikey();

    if (checkSelfApiKey && gatewayApiKey == null)
    {
        return res
            .status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST)
            .json({ok: 'false', msg: MSG_NO_APIKEY});
    }

    try {
        if (checkSelfApiKey) {
            doValidateApikey(gatewayApiKey);
        }
        
        const axiosConfig = parseRequest(req, microservice, newUrl);
        logDebug(`On send request axios: ${JSON.stringify(axiosConfig)}`);
        return await handleAxiosRequestConfig(axiosConfig, res, 0);
    }

    catch(exception) 
    {
        return res
            .status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE)
            .json({ok: 'false', msg: MSG_INVALID_APIKEY});
    }
}

const doRequestAxios = async (req, res, microservice, newUrl) => { 
    const {status, data} = await sendRequestAxios(req, res, microservice, newUrl);
    logInfo(`On request axios response: ${status} ${JSON.stringify(data)}`);
    res.status(status).json(data);
}

/**
 * 
 * @param {*} next : (req, res, status1, data1) => (status, data)
 */
const doChainRequestAxios = async (req, res, microservice, newUrl, next) => { 
    const {status: status1, data: data1} = await sendRequestAxios(req, res, microservice, newUrl);
    const {data, status} = await next(req, res, data1, status1);
    logInfo(`On chain request axios response: ${status} ${JSON.stringify(data)}`);
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
    logDebug(`On get axios : ${JSON.stringify(instanceAxios)}`);
    return await instanceAxios.get(endpoint, body);
}

module.exports = {
    checkIfGatewayApiKeyIsActive,
    handleAxiosRequestConfig,
    doRequestAxios,
    doChainRequestAxios,
    sendRequestAxios,
    doGetAxios
}