const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doRequestAxios} = require('../../helpers/axiosHelper');

/**
 * @returns Los datos del usuarios creado.
 */
const createUser =  async (req, res = response) => {
    const url = getServiceStatus(SERVICES.USERS).target;
    const body = req.body;
    const headers = {};
    const params = {};
    const endpoint = 'user';
    doRequestAxios(req, res, url, headers, body, params, endpoint);
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
    const params = {};
    const uid = req.params.id;
    const endpoint = `user/`+uid;
    doRequestAxios(req, res, url, headers, body, params, endpoint);
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
    const params = {};
    const uid = req.params.id;
    const endpoint = `user/`+uid;
    doRequestAxios(req, res, url, headers, body, params, endpoint);
}

module.exports = {
    createUser,
    updateUser,
    deleteUser
}