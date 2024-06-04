const {
    doRequestAxios,
} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');

/**
 * @returns Respuesta de la solicitud http
 */
const matchapi = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.MATCHES);
}


module.exports = {
    matchapi,
}