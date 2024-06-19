const {doRequestAxios} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');

/**
 * @returns Respuesta de la solicitud http
 */
const pin =  async (req, res) => {
    await doRequestAxios(req, res, SERVICES.USERS);
}

module.exports = {
    pin
}