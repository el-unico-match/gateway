const {response} = require('express');
const {
    startUsers,
    stopUsers,
    getUsersService} = require('../servicesStatus/servicesStatus');

const start = async (req, res = response) => {
    res.json({
        ok: true,
        service: getUsersService()
    })
}

const stop = async (req, res = response) => {
    console.log("Stop");
    res.json({
        ok: true,
        service: getUsersService()
    })
}

module.exports = {
    start,
    stop
}