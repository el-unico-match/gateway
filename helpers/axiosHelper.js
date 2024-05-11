const {response} = require('express');
const axios = require('axios');
const { HTTP_SERVER_ERROR_5XX } = require('./httpCodes');
const {MSG_ERROR_WITH_SERVICE_REQUEST} = require('../messages/services');
const TIMEOUT = 15000;

const doRequestAxios =  async (method, baseURL, headers, body, params, endpoint, res = response) => { 
    let result;
    try {
        let instanceAxios = axios.create({
            baseURL: baseURL, 
            headers: headers,
            params: params,
            timeout: TIMEOUT
        });
        switch (method) {
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
            const errorDetail = error.code ? error.code : _error;
            const url = `${baseURL}${endpoint}`;
            console.log(`GATEWAY: On request to ${url}: ${errorDetail}`);
            res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json(
                {
                    ok: false,
                    msg: `${MSG_ERROR_WITH_SERVICE_REQUEST}: ${errorDetail}`,
                    url,
                    headers,
                    body,
                    params
            })
        }          
    }
}

/**
 * 
 * @returns El resultado del request pudiendo lanzar excepciones.
 */
const doGetAxios = async (baseURL, headers, body, params, endpoint) => {
    let instanceAxios = axios.create({
        baseURL: baseURL, 
        headers: headers,
        params: params,
        timeout: 4*TIMEOUT
    });
    return await instanceAxios.get(endpoint, body);
}

module.exports = {
    doRequestAxios,
    doGetAxios
}