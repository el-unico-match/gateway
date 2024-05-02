const {response} = require('express');
const axios = require('axios');
const {SERVICES} = require('../../types/services');
const {MSG_ERROR_WITH_SERVICE_REQUEST} = require('../../messages/services');
const {HTTP_SERVER_ERROR_5XX} = require('../../helpers/httpCodes')
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');

/**
 * @returns Los datos del usuarios creado.
 */
const createUser =  async (req, res = response) => {
    let url = getServiceStatus(SERVICES.USERS).target;
    let body = req.body;
    let headers = {
        'x-token': req.header('x-token')
    };
    let endpoint = '/user';
    doRequestAxios(req, res, url, headers, body, endpoint);
}

/**
 * @returns Los datos del usuarios actualizado.
 */
const updateUser =  async (req, res = response) => {    
    let url = getServiceStatus(SERVICES.USERS).target;
    let body = req.body;
    let headers = {
        'x-token': req.header('x-token')
    };
    const userId = req.params.id;
    let endpoint = '/user/' + userId;
    doRequestAxios(req, res, url, headers, body, endpoint);
}

/**
 * @returns Informe de borrado.
 */
const deleteUser =  async (req, res = response) => {
    let url = getServiceStatus(SERVICES.USERS).target;
    let body = req.body;
    let headers = {
        'x-token': req.header('x-token')
    };
    const userId = req.params.id;
    let endpoint = '/user/' + userId;
    doRequestAxios(req, res, url, headers, body, endpoint);
}

module.exports = {
    createUser,
    updateUser,
    deleteUser
}