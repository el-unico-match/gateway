const {response} = require('express');
const {doRequestAxios} = require('../helpers/axiosHelper');
const {parseRequest} = require('../helpers/requestHelper');
const {SERVICES} = require('../types/services');

const ENDPOINT_FILTER_USERS = "api/";
const ENDPOINT_FILTER_USERS_PROFILES = "api/";
const PREFIX_USERS = "";
const PREFIX_USERS_PROFILES = "";

/**
 * @returns Respuesta de la solicitud http
 */
const users =  async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.USERS, PREFIX_USERS, ENDPOINT_FILTER_USERS);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

/**
 * @returns Respuesta de la solicitud http
 */
const profiles =  async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.PROFILES, PREFIX_USERS_PROFILES, ENDPOINT_FILTER_USERS_PROFILES);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

module.exports = {
    users,
    profiles
}