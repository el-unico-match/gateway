const {doRequestAxios} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');

/**
 * @returns Respuesta de la solicitud http
 */
const services =  async (req, res) => {
    await doRequestAxios(req, res, SERVICES.SERVICES);
}

module.exports = {
    services
}