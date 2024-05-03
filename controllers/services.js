const {response} = require('express');
const {HTTP_SUCCESS_2XX} = require('../helpers/httpCodes');
const axios = require('axios');
const {SERVICES} = require('../types/services');
const {getServiceStatus} = require('../servicesStatus/servicesStatus');

/**
 * 
 * @param {*} req body vacío
 * @returns respuesta con los servicios con su estado.
 */
const getServices = async (req, res = response) => {
    return res.status(HTTP_SUCCESS_2XX.OK).json({
        ok: true,
        services: await getAllServicesCompleteStatus()
    })
}

/**
 * 
 * @returns El estado de todos los servicios incluyendo el estado consultado remotamente.
 */
const getAllServicesCompleteStatus = async () => {
    return {
        matches: await getServiceCompleteStatus(getServiceStatus(SERVICES.MATCHES)),
        messages: await getServiceCompleteStatus(getServiceStatus(SERVICES.MESSAGES)),
        profiles: await getServiceCompleteStatus(getServiceStatus(SERVICES.PROFILES)),
        users: await getServiceCompleteStatus(getServiceStatus(SERVICES.USERS))
    }
}

/**
 * 
 * @param {*} service Servicio sobre el cual se quiere chequear su estado.
 * @returns Estado del servicio al consultar el mismo de manera remota.
 */
const getServiceCompleteStatus = async (service) => {
    const instanceAxios = axios.create({baseURL: service.target, proxy: false, timeout: 5000});
    let serviceStatus;
    try {
        let result = await instanceAxios.get('/status');
        serviceStatus = {
            active: service.active,
            target: service.target,
            online: true,
            detail: result.data.status
        };
    } catch (error) {
        serviceStatus = {
            active: service.active,
            target: service.target,
            online: false,
            detail: error.message
        };
        console.log(`On check service ${service.name} online: ${error.message}`);
    };
    return serviceStatus;    
}

module.exports = {
    getServices,
}