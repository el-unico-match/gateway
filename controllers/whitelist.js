const {setApikeys} = require('../helpers/apikeys');
const {logInfo} = require('../helpers/log/log');
const {checkIfGatewayApiKeyIsActive} = require('../helpers/axiosHelper')

/**
 * @returns Respuesta de la solicitud http
 */
const whitelist = (req, res) => {
    const apikeys = req.body?.apiKeys
    const statusToResponse = 200;
    const dataToReponse = {
        ok: true,
        apikeys: apikeys    
    };
    setApikeys(apikeys);
    logInfo(`On get status response: ${statusToResponse}; ${JSON.stringify(dataToReponse)}`);
    checkIfGatewayApiKeyIsActive(res, statusToResponse, dataToReponse);    
}

module.exports = {
    whitelist
}