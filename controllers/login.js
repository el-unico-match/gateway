const {doRequestAxios} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');

/**
 * @returns Respuesta de la solicitud http
 */
const login =  async (req, res) => {
    await doRequestAxios(req, res, SERVICES.USERS);
}

module.exports = {
    login
}