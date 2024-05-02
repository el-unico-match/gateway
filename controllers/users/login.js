const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doRequestAxios} = require('../../helpers/axiosHelper');

/**
 * @returns Los datos del usuarios logueado.
 */
const loginUser =  async (req, res = response) => {
    const url = getServiceStatus(SERVICES.USERS).target;
    const body = req.body;
    let headers = {};
    const endpoint = 'login';
    const params = {};
    doRequestAxios(req, res, url, headers, body, params, endpoint);
}

module.exports = {loginUser}