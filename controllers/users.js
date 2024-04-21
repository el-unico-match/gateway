const {response} = require('express');
const {SERVICES} = require('../types/services')
const axios = require('axios');

const {
    startService,
    stopService,
    getServiceStatus} = require('../servicesStatus/servicesStatus');

const getUserStatus = () => {
    return getService(SERVICES.USERS)
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
    const usersApiBaseUrl = getServiceStatus(SERVICES.USERS).target;
    
    try {
        const {data} = await axios.post(`${usersApiBaseUrl}/api/login`, req.body);
        res.json(data);
    }

    catch (exception) {
        res
            .status(502)
            .json({ok: false, message: exception.message});
    }
}

module.exports = {
    start,
    stop,
    getService,
    getUsers,
    loginUser
}