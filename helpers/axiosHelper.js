const {parseRequest} = require('../helpers/requestHelper');
const axios = require('axios');
const {MSG_ERROR_WITH_SERVICE_REQUEST} = require('../messages/services');
const MAX_RETRY_ATTEMPTS = 3;
const MS = 1000;
const MUTIPLIER = 2;

const sendRequestAsync = async (req, res, microservice) => {
    const axiosConfig = parseRequest(req, microservice);
    const {status, data} = await axios(axiosConfig);
    res.status(status).json(data);
}

const doRequestAxios =  async (req, res, microservice, retryAttempt = 0) => { 

    try {
        await sendRequestAsync(req, res, microservice);
    } 
    
    catch (error) {
        const status = error?.response?.status;
        const data = error?.response?.data;

        if ((error?.code === 'ECONNREFUSED' || status == axios.HttpStatusCode.ServiceUnavailable) && retryAttempt < MAX_RETRY_ATTEMPTS) {
            retryAttempt++;
            console.log(`Retry attempt #${retryAttempt} because server was unavailable`);
            
            const delay = retryAttempt * MUTIPLIER * MS;
            await new Promise(r => setTimeout(r, delay));

            await doRequestAxios(req, res, microservice, retryAttempt);
        }

        try {
            res.status(status).json(data);
        }
        
        catch (_error) {
            const url = `${req.baseUrl}${req.url}`;
            console.log(`GATEWAY: On request to ${url}: ${errorDetail}`);

            const axiosConfig = parseRequest(req, microservice);
            const errorDetail = error?.code ?? _error;
            const status = error?.code === 'ECONNREFUSED' ? axios.HttpStatusCode.ServiceUnavailable : axios.HttpStatusCode.InternalServerError;

            const data = {
                ok: false,
                req: {...axiosConfig},
                msg: `${MSG_ERROR_WITH_SERVICE_REQUEST}: ${errorDetail}`,
            }

            res.status(status).json(data)
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