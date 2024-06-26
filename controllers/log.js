const {handleAxiosRequestConfig} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');
const {parseHeaders} = require('../helpers/requestHelper');
const {getServiceStatus} = require('../servicesStatus/servicesStatus');
const {isService} = require('../types/services');
const {
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SUCCESS_2XX
} = require('../helpers/httpCodes');
const {MSG_INVALID_SERVICE} = require('../messages/services');
const {readLog} = require('../helpers/log/log');
const {
    logInfo,
    logDebug
} = require('../helpers/log/log');

/**
 * @returns Respuesta de la solicitud http
 */
const getLogGateway =  async (req, res) => {
    const dataToReponse = {
        ok: true,
        log: readLog()            
    };
    res.status(HTTP_SUCCESS_2XX.OK).json(dataToReponse);
}

/**
 * @returns Respuesta de la solicitud http
 */
const getLogUser =  async (req, res) => {
    await getLogService(req, res, SERVICES.USERS);
}

/**
 * @returns Respuesta de la solicitud http
 */
const getLog =  async (req, res) => {
    const serviceName = req.params.service;
    if (isService(serviceName)) {
        await getLogService(req, res, serviceName);
    } else {
        res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
            ok: false,
            msg: MSG_INVALID_SERVICE
        });
    }    
}

/**
 * @returns Respuesta de la solicitud http
 */
const getLogService =  async (req, res, serviceName) => {
    const axiosConfig = {
        headers: parseHeaders(req),
        method: req.method,
        baseURL: getServiceStatus(serviceName).target,
        url: 'log',
        params: req.query,
        data: req.body
    }
    logDebug(`On send request axios: ${JSON.stringify(axiosConfig)}`);
    const {status, data} = await handleAxiosRequestConfig(axiosConfig, res, 0);
    logInfo(`On request log from ${serviceName} response: ${status}`);
    res.status(status).json(data);
}

module.exports = {
    getLogUser,
    getLog,
    getLogGateway
}