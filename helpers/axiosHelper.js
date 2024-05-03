const {response} = require('express');
const axios = require('axios');
const { HTTP_SERVER_ERROR_5XX } = require('./httpCodes');
const {MSG_ERROR_WITH_SERVICE_REQUEST} = require('../messages/services');

const doRequestAxios =  async (req, res = response, baseURL, headers, body, params, endpoint) => { 
    let result;
    try {
        let instanceAxios = axios.create(
            {baseURL: baseURL, 
            headers: headers,
            params: params
        });        
        switch (req.method) {
            case 'DELETE':
                result = await instanceAxios.delete(endpoint, body);
                break;
            case 'GET':
                result = await instanceAxios.get(endpoint, body);
                break;
            case 'PATCH':
                result = await instanceAxios.patch(endpoint, body);
                break;    
            case 'POST':
                result = await instanceAxios.post(endpoint, body);
                break;    
            case 'PUT':
                result = await instanceAxios.put(endpoint, body);
                break;
        }
        res.status(result.status).json(
            result.data                    
        );  
    } catch (error) {
        try {
            res.status(error.response.status).json(
                error.response.data
            )
        } catch (_error) {
            if (error.code) {
                console.log(`GATEWAY: On request to ${baseURL}/${endpoint}: ${error.code}`);
            } else {
                console.log(`GATEWAY: On request to ${baseURL}/${endpoint}: ${_error}`);
            }          
            res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json(
                {
                    ok: false,
                    msg: MSG_ERROR_WITH_SERVICE_REQUEST
            })
        }          
    }
}

module.exports = {
    doRequestAxios
}