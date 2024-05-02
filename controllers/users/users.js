const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doRequestAxios} = require('../../helpers/axiosHelper');

/**
 * @returns Los usuarios registrados.
 */
const getUsers =  async (req, res = response) => {
    const url = getServiceStatus(SERVICES.USERS).target;
    const body = req.body;
    const headers = {
        'x-token': req.header('x-token')
    };
    const params = {};
    const endpoint = 'users';
    doRequestAxios(req, res, url, headers, body, params, endpoint);
}

module.exports = {getUsers}