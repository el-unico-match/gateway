const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doRequestAxios} = require('../../helpers/axiosHelper');

/**
 * @returns Un nuevo token a partir del pasado por header.
 */
const refreshToken =  async (req, res = response) => {
    const url = getServiceStatus(SERVICES.USERS).target;
    const body = req.body;
    const headers = {
        'x-token': req.header('x-token')
    };
    const endpoint = 'token';
    const params = {};
    doRequestAxios(req, res, url, headers, body, params, endpoint);
}

module.exports = {
    refreshToken,
}