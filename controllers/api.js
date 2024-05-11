const {response} = require('express');
const {doRequestAxios} = require('../helpers/axiosHelper');
const {parseRequest} = require('../helpers/requestHelper');
 
/**
 * @returns Respuesta de la solicitud http
 */
const allApi =  async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

module.exports = {
    allApi
}