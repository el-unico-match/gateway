const jwt = require('jsonwebtoken');
const {getApikeys} = require('../helpers/apikeys');
const {MSG_APIKEY_NO_MATCH} = require('../messages/apikey.js');
const {logDebug} = require('../helpers/log/log');

/**
 * 
 * Válida el x-apikey del request y compara con las apikeys locales validando
 * la propia.
 */
const doValidateApikey = (apikeyToValidate) =>  {
    logDebug(`On validate apikey: ${apikeyToValidate}`);
    // verificar integridad apikeyToValidate
    const apikeyToValidateData = jwt.decode(apikeyToValidate);
    logDebug(`On validate apikey gateway data: ${JSON.stringify(apikeyToValidateData)}`);
    const whiteListApiKeys = getApikeys();
    console.log("¿Array? ",Array.isArray(whiteListApiKeys));
    if (Array.isArray(whiteListApiKeys) && whiteListApiKeys.some( x => x == apikeyToValidate)) {
        logDebug(`On validate apikey: apikey validated`);     
    } else {
        logDebug(`On validate apikey: throw error`);     
        throw new Error(MSG_APIKEY_NO_MATCH)
    }
}

module.exports = {
    doValidateApikey,
}

