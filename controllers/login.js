const {response} = require('express');
const {doRequestAxios} = require('../helpers/axiosHelper');
const {parseRequest} = require('../helpers/requestHelper');
const {SERVICES} = require('../types/services');

const ENDPOINT_FILTER_LOGIN = "api/";
const PREFIX_LOGIN = "";

/**
 * @returns Respuesta de la solicitud http
 */
const login =  async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.USERS, PREFIX_LOGIN, ENDPOINT_FILTER_LOGIN);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

module.exports = {
    login
}