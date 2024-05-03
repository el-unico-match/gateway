const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doRequestAxiosSinglePathParameter,
doRequestAxios} = require('../../helpers/axiosHelper');

/**
 * @returns Los datos del usuarios creado.
 */
const createUser =  async (req, res = response) => {
    const url = getServiceStatus(SERVICES.USERS).target;
    const body = req.body;
    const headers = {};
    const endpoint = 'user';
    doRequestAxiosSinglePathParameter(req, res, url, headers, body, endpoint);
}

/**
 * @returns Los datos del usuarios actualizado.
 */
const updateUser =  async (req, res = response) => {    
    const url = getServiceStatus(SERVICES.USERS).target;
    const body = req.body;
    const headers = {
        'x-token': req.header('x-token')
    };
    const uid = req.params.id;
    const endpoint = `user/`+uid;
    doRequestAxiosSinglePathParameter(req, res, url, headers, body, endpoint);
}

/**
 * @returns Informe de borrado.
 */
const deleteUser =  async (req, res = response) => {
    const url = getServiceStatus(SERVICES.USERS).target;
    const body = req.body;
    const headers = {
        'x-token': req.header('x-token')
    };
    const uid = req.params.id;
    const endpoint = `user/${uid}`;
    doRequestAxiosSinglePathParameter(req, res, url, headers, body, endpoint);
}

module.exports = {
    createUser,
    updateUser,
    deleteUser
}