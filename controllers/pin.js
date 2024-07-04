const {doRequestAxios} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');

/**
 * @returns Respuesta de la solicitud http
 */
const pin =  async (req, res) => {
    const newUrl = req.originalUrl.replace('/api','');
    req.baseUrl = '';    
    await doRequestAxios(req, res, SERVICES.USERS, newUrl);
}

module.exports = {
    pin
}