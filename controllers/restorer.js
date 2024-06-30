const {doRequestAxios} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');

/**
 * @returns Respuesta de la solicitud http
 */
const restorer =  async (req, res) => {
    req.baseUrl = '';
    await doRequestAxios(req, res, SERVICES.USERS, 'restorer');
}

module.exports = {
    restorer
}