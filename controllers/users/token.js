const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');

/**
 * @returns Los datos del usuarios logueado.
 */
const refreshToken =  async (req, res = response) => {
    let url = getServiceStatus(SERVICES.USERS).target;
    let body = req.body;
    let headers = {
        'x-token': req.header('x-token')
    };
    let endpoint = '/token';
    doRequestAxios(req, res, url, headers, body, endpoint);
}

module.exports = {
    refreshToken,
}