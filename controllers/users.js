const {response} = require('express');
const {SERVICES} = require('../types/services')
const axios = require('axios');

const {
    startService,
    stopService,
    getServiceStatus} = require('../servicesStatus/servicesStatus');

const getUserStatus = () => {
    res.json({
        ok: true,
        service: getServiceStatus(SERVICES.USERS)
    })
}

const start = async (req, res = response) => {
    res.json({
        ok: true,
        service: startService(SERVICES.USERS)
    })
}

const stop = async (req, res = response) => {
    res.json({
        ok: true,
        service: stopService(SERVICES.USERS)
    })
}

const getService = async (req, res = response) => {
    res.json({
        ok: true,
        service: getServiceStatus(SERVICES.USERS)
    })
}

const getUsers = async (req, res = response) => {
    let url = getServiceStatus(SERVICES.USERS).target;
    res.json({
        ok: true,
        service: getServiceStatus(SERVICES.USERS)
    })
}

const loginUser =  async (req, res = response) => {
    if (getUserStatus()) {

    } else {
        
    }
    let url = getServiceStatus(SERVICES.USERS).target+'/api/auth';
    console.log(req.body);
    //console.log(req.header('x_token'));
    let resultado = await axios.get('https://users-uniquegroup-match-fiuba.azurewebsites.net/api/status');
    console.log(resultado);
    console.log(axios.isCancel('something'));
    //https://users-uniquegroup-match-fiuba.azurewebsites.net/api/status
    res.json({
        ok: true,
        service: getServiceStatus(SERVICES.USERS)
    })
}

module.exports = {
    start,
    stop,
    getService,
    getUsers,
    loginUser
}