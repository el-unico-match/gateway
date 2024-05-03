const {response} = require('express');
const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doRequestAxios} = require('../../helpers/axiosHelper');

/**
 * 
 * @returns El nuevo perfil creado.
 */
const createUserProfile = async (req, res = response) => {
    const url = getServiceStatus(SERVICES.PROFILES).target;
    const body = req.body;
    const headers = {
        'x-token': req.header('x-token')
    };
    const params = {};
    const endpoint = 'user/profile';
    doRequestAxios(req, res, url, headers, body, params, endpoint);
}

/**
 * 
 * @returns El perfil del usuario asociado al id.
 */
const getUserProfile = async (req, res = response) => {
    const url = getServiceStatus(SERVICES.PROFILES).target;
    const body = {};
    const headers = {
        'x-token': req.header('x-token')
    };
    const params = {};
    const uid = req.params.id;
    const endpoint = 'user/profile/'+uid;
    doRequestAxios(req, res, url, headers, body, params, endpoint);
}

/**
 * @returns Los datos del usuarios actualizado.
 */
const updateUserProfile =  async (req, res = response) => {
    const url = getServiceStatus(SERVICES.PROFILES).target;
    const body = req.body;
    const headers = {
        'x-token': req.header('x-token')
    };
    const params = {};
    const uid = req.params.id;
    const endpoint = 'user/profile/'+uid;
    doRequestAxios(req, res, url, headers, body, params, endpoint);
}

/**
 * @returns Informe de borrado.
 */
const deleteUserProfile =  async (req, res = response) => {
    const url = getServiceStatus(SERVICES.PROFILES).target;
    const body = {};
    const headers = {
        'x-token': req.header('x-token')
    };
    const params = {};
    const uid = req.params.id;
    const endpoint = 'user/profile/'+uid;
    doRequestAxios(req, res, url, headers, body, params, endpoint);
}

module.exports = {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile
}