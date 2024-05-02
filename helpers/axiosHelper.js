const {response} = require('express');
const axios = require('axios');

const doRequestAxios =  async (req, res = response, baseURL, headers, body, endpoint) => {
    let result;
    try {
        const instanceAxios = axios.create(
            {baseURL: baseURL, 
            headers: headers,
        });
        switch (req.method) {
            case 'DELETE':
                result = await instanceAxios.delete(endpoint, body);
                break;
            case 'GET':
                result = await instanceAxios.get(endpoint, body);
                break;
            case 'POST':
                result = await instanceAxios.post(endpoint, body);
                break;    
            case 'PATCH':
                result = await instanceAxios.patch(endpoint, body);
                break;
        }
        res.status(result.status).json(
                result.data                    
        );  
    } catch (error) {
        res.status(error.response.status).json(
            {
                ok: false,
                msg: error.code
            })
    }
}

module.exports = {
    doRequestAxios
}