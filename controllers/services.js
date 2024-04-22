const {response} = require('express');
const {
    HTTP_SUCCESS_2XX,
    HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');
const axios = require('axios');
const {SERVICES} = require('../types/services');
const {ROLES} = require('../types/role');
const {checkAccessRoleBased} = require('../helpers/validateAccess');
const {MSG_ACCESS_DENIED} = require('../messages/services');
const {
    getServiceStatus,
    setServiceActive} = require('../servicesStatus/servicesStatus');

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
 * @param {*} req body con el servicio a actualizar (service) y 
 * el estado del servicio (active).
 * @returns respuesta el servicio actualizado con su estado.
 */
const updateServiceStatus = async (req, res = response) => {
    const {service, active} = req.body;
    if (await checkAccessRoleBased(req, ROLES.ADMINISTRATOR)) {
        setServiceActive(service, active);
        return res.status(HTTP_SUCCESS_2XX.OK).json({
            ok: true,
            name: service,
            status: await getServiceCompleteStatus(getServiceStatus(service))
        });
    } else {
        return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
            ok:false,
            msg: MSG_ACCESS_DENIED
        });
    }    
}

/**
 * 
 * @returns El estado de todos los servicios incluyendo si se encuentra online.
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
 * @returns El estado completo del servicio incluyendo su estado en línea.
 */
const getServiceCompleteStatus = async (service) => {
    return {
        active: service.active,
        target: service.target,
        online: await checkServiceIsOnline(service),
    }
}

/**
 * 
 * @param {*} service Servicio sobre el cual se quiere chequear su estado.
 * @returns Si el servicio se encuentra el línea.
 */
const checkServiceIsOnline = async (service) => {
    switch (service.name) {
        case SERVICES.MATCHES:
            return false;
        case SERVICES.MESSAGES:
            return false;
        case SERVICES.PROFILES:
            return false;
        case SERVICES.USERS:
            try {
                //TODO usar servicios del controlador
                let resultado = await axios.get('https://users-uniquegroup-match-fiuba.azurewebsites.net/api/status');
                return (resultado.status === HTTP_SUCCESS_2XX.OK);
            } catch (error) {
                console.log(error);
                return false;    
            };
    }        
}

module.exports = {
    getServices,
    updateServiceStatus
}