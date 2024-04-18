const {response} = require('express');
const {
    getServicesStatus} = require('../servicesStatus/servicesStatus');

const getServices = async (req, res = response) => {

    res.json({
        ok: true,
        services: getServicesStatus()
    })
}

module.exports = {
    getServices
}