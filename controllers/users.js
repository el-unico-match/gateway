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
    const usersApiLoginUrl = `${getServiceStatus(SERVICES.USERS).target}/api/login`;
    
    try {
        const {data} = await axios.post(usersApiLoginUrl, req.body);
        res.json(data);
    }

    catch ({response}) {
        res
            .status(response.status)
            .json(response.data);
    }
}

module.exports = {
    start,
    stop,
    getService,
    getUsers,
    loginUser
}