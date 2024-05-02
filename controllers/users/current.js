const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doRequestAxios} = require('../../helpers/axiosHelper');

/**
 * 
 * @returns Los datos del usuario asociado el token del header.
 */
const getDataUser = async (req, res = response) => {
    const url = getServiceStatus(SERVICES.USERS).target;
    const body = req.body;
    const headers = {
        'x-token': req.header('x-token')
    };
    const params = {}
    const endpoint = 'current';
    doRequestAxios(req, res, url, headers, body, params, endpoint);
}

module.exports = {getDataUser}