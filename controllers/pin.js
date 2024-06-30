const {doRequestAxios} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');

/**
 * @returns Respuesta de la solicitud http
 */
const pin =  async (req, res) => {
    req.baseUrl = '';
    await doRequestAxios(req, res, SERVICES.USERS, 'pin');
}

module.exports = {
    pin
}