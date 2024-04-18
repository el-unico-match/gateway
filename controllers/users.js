const {response} = require('express');
const {SERVICES} = require('../types/services')
const {axios} = require('axios');
const {
    startService,
    stopService,
    getServiceStatus} = require('../servicesStatus/servicesStatus');

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
    let url = getServiceStatus(SERVICES.USERS).target+'/api/auth';
    console.log(req.body);
    //console.log(req.header('x_token'));
    axios.post(url, req.body)
    
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