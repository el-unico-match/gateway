const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doGetAxios} = require('../../helpers/axiosHelper');

/**
 * 
 * @return retorna el resultado de consultar el estado del servicio
 * pudiendo lanzar excepciones.
 */
const getStatus = async (serviceName) => {
    const url = getServiceStatus(serviceName).target;
    const body = {};
    const headers = {};
    const params = {};
    const endpoint = 'status';
    return await doGetAxios(url, headers, body, params, endpoint);
}

module.exports = {getStatus}