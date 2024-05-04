const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const axios = require('axios');

/**
 * 
 * @return retorna como true (y el estado del servicio) si
 * el servicio funciona correctamente, y en caso contrario false 
 * con mensaje de error.
 */
const getStatusUser = async (req, res = response) => {
    const baseURL = getServiceStatus(SERVICES.USERS).target;
    const endpoint = 'status';
    const instanceAxios = axios.create({baseURL: baseURL, proxy: false, timeout: 5000});
    let serviceStatus;
    try {
        let result = await instanceAxios.get(endpoint);
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

module.exports = {getStatusUsers}