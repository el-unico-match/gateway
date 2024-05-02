const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');

/**
 * @returns Los datos del usuarios logueado.
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