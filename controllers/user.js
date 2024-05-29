const {doRequestAxios} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');

/**
 * @returns Respuesta de la solicitud http
 */
const current = async (req, res) => {
    doRequestAxios(req, res, SERVICES.USERS);
}

/**
 * @returns Respuesta de la solicitud http
 */
const match_filter = async (req, res) => {
    doRequestAxios(req, res, SERVICES.MATCHES);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.USERS);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_id = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.USERS);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_id_match = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.MATCHES);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_id_matchs = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.MATCHES);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_match = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.MATCHES);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_profile = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.PROFILES);
}

module.exports = {
    current,
    user,
    user_id,
    user_id_match, 
    user_id_matchs, 
    user_match,
    user_profile,
    match_filter,
}