const {setApikeys} = require('../helpers/apikeys');
const {logInfo} = require('../helpers/log/log');

/**
 * @returns Respuesta de la solicitud http
 */
const whitelist =  async (req, res) => {
    const apikeys = req.body?.apiKeys
    const statusToResponse = 200;
    const dataToReponse = {
        ok: true,
        apikeys: apikeys    
    };
    setApikeys(apikeys);
    logInfo(`On get status response: ${statusToResponse}; ${JSON.stringify(dataToReponse)}`);
    res.status(statusToResponse).json(dataToReponse);    
}

module.exports = {
    whitelist
}