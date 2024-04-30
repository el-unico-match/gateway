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
const { setDefaultResultOrder } = require("dns");
setDefaultResultOrder("ipv4first");
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
    const instanceAxios = axios.create({baseURL: service.target, proxy: false, timeout: 5000});
    switch (service.name) {
        case SERVICES.MATCHES:
            try {
                let resultado = await instanceAxios.get('/status');
                return (resultado.status === HTTP_SUCCESS_2XX.OK);
            } catch (error) {
                console.log(`On check service ${service.name} online: ${error.message}`);
                return false;    
            };
        case SERVICES.MESSAGES:
            try {
                let resultado = await instanceAxios.get('/status');
                return (resultado.status === HTTP_SUCCESS_2XX.OK);
            } catch (error) {
                console.log(`On check service ${service.name} online: ${error.message}`);
                return false;    
            };
        case SERVICES.PROFILES:
            try {
                let resultado = await instanceAxios.get('/status');
                return (resultado.status === HTTP_SUCCESS_2XX.OK);
            } catch (error) {
                console.log(`On check service ${service.name} online: ${error.message}`);
                return false;    
            };
        case SERVICES.USERS:
            try {
                let resultado = await instanceAxios.get('status');
                return (resultado.status === HTTP_SUCCESS_2XX.OK);
            } catch (error) {
                console.log(error);
                console.log(process.env.MY_ROUTE);
                console.log(`On check service ${service.name} online: ${error.message}`);
                return false;    
            };
    }   
    /*
    const instanceAxios = axios.create({baseURL: 'http://localhost:4000'});
    try {
        let resultado = await instanceAxios.get('/api-doc/#/');
        return (resultado.status === HTTP_SUCCESS_2XX.OK);
    } catch (error) {
        console.log(error);
        console.log(`On check service ${service.name} online: ${error.message}`);
        return false;    
    };
    //http://localhost:4000/api-doc/#/
    return false;*/
}

module.exports = {
    getServices,
    updateServiceStatus
}