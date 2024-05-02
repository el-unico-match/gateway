const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doRequestAxios} = require('../../helpers/axiosHelper');

/**
 * 
 * @returns Los datos del usuario asociado el token del header.
 */
const getDataUser = async (req, res = response) => {
    let url = getServiceStatus(SERVICES.USERS).target;
    let body = req.body;
    let headers = {
        'x-token': req.header('x-token')
    };
    let endpoint = '/current';
    doRequestAxios(req, res, url, headers, body, endpoint);
}

module.exports = {getDataUser}