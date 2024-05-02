const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doRequestAxios} = require('../../helpers/axiosHelper');

/**
 * @returns Los datos del usuarios logueado.
 */
const loginUser =  async (req, res = response) => {
    let url = getServiceStatus(SERVICES.USERS).target;
    let body = req.body;
    let headers = {};
    let endpoint = '/login';
    doRequestAxios(req, res, url, headers, body, endpoint);
}

module.exports = {loginUser}