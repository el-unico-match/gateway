const {response} = require('express');
const {doRequestAxios} = require('../helpers/axiosHelper');
const {parseRequest} = require('../helpers/requestHelper');
const {SERVICES} = require('../types/services');

const ENDPOINT_FILTER_TOKEN = "api/";
const PREFIX_TOKEN = "";

/**
 * @returns Respuesta de la solicitud http
 */
const token =  async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.USERS, PREFIX_TOKEN, ENDPOINT_FILTER_TOKEN);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

module.exports = {
    token
}