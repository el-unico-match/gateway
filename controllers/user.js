const {response} = require('express');
const {doRequestAxios} = require('../helpers/axiosHelper');
const {parseRequest} = require('../helpers/requestHelper');
const {SERVICES} = require('../types/services');

const PREFIX_CURRENT = "";
const PREFIX_USER = "";
const PREFIX_USER_ID = "user/";
const PREFIX_USER_PROFILE = "user/";
const PREFIX_USER_ID_MATCH = "user/";
const PREFIX_USER_ID_MATCHS = "user/";
const PREFIX_USER_MATCH = "user/";
const ENDPOINT_FILTER_USER = "api/";
const ENDPOINT_FILTER_USER_ID = "api/user/";
const ENDPOINT_FILTER_USER_ID_MATCH = "api/user/";
const ENDPOINT_FILTER_USER_ID_MATCHS = "api/user/";
const ENDPOINT_FILTER_USER_MATCH = "api/user/";
const ENDPOINT_FILTER_CURRENT = "api/user/";
const ENDPOINT_FILTER_USER_PROFILE = "api/user/";

/**
 * @returns Respuesta de la solicitud http
 */
const current = async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.USERS, PREFIX_CURRENT, ENDPOINT_FILTER_CURRENT);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user = async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.USERS, PREFIX_USER, ENDPOINT_FILTER_USER);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_id = async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.USERS, PREFIX_USER_ID, ENDPOINT_FILTER_USER_ID);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_id_match = async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.MATCHES, PREFIX_USER_ID_MATCH, ENDPOINT_FILTER_USER_ID_MATCH);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_id_matchs = async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.MATCHES, PREFIX_USER_ID_MATCHS, ENDPOINT_FILTER_USER_ID_MATCHS);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_match = async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.MATCHES, PREFIX_USER_MATCH, ENDPOINT_FILTER_USER_MATCH);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_profile = async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req, SERVICES.PROFILES, PREFIX_USER_PROFILE, ENDPOINT_FILTER_USER_PROFILE);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}

module.exports = {
    current,
    user,
    user_id,
    user_id_match, 
    user_id_matchs, 
    user_match,
    user_profile
}