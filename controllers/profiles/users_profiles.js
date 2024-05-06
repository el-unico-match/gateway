const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doRequestAxios} = require('../../helpers/axiosHelper');

/**
 * 
 * @returns Los perfiles de los usuarios.
 */
const getUsersProfiles = async (req, res = response) => {
    const url = getServiceStatus(SERVICES.PROFILES).target;
    const body = {};
    const headers = {
        'x-token': req.header('x-token')
    };
    const params = {};
    const endpoint = 'users/profiles';
    doRequestAxios(req, res, url, headers, body, params, endpoint);
}

module.exports = {
    getUsersProfiles
}