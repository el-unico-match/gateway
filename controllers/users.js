const {doRequestAxios} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');

/**
 * @returns Respuesta de la solicitud http
 */
const users =  async (req, res) => {
    await doRequestAxios(req, res, SERVICES.USERS);
}

/**
 * @returns Respuesta de la solicitud http
 */
const profiles =  async (req, res) => {
    await doRequestAxios(req, res, SERVICES.PROFILES);
}

module.exports = {
    users,
    profiles
}