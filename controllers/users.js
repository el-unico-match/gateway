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
    const usersApiUrl = getServiceStatus(SERVICES.USERS).target;
    try {
        const {data} = await axios.post(`${usersApiUrl}/api/login1`, req.body);
        res.json(data);
    }
    catch (exception) {
        // this could be a common gateway exception handling
        // const result = await axios.get(`${usersApiUrl}/api/status`)
        // if ( result.status == 400 )
        // {
        //     res.status(503);
        // }
        
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