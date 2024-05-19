const {response} = require('express');
const {doRequestAxios} = require('../helpers/axiosHelper');
const {parseRequest} = require('../helpers/requestHelper');
const {SERVICES} = require('../types/services');

const ENDPOINT_FILTER_SERVICES = "api/";
const PREFIX_SERVICES = "";

/**
 * @returns Respuesta de la solicitud http
 */
const services =  async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.SERVICES, PREFIX_SERVICES, ENDPOINT_FILTER_SERVICES);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

module.exports = {
    services
}