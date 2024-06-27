const axios  = require('axios'); 
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {SERVICES} = require('../../types/services');
const {parseHeaders} = require('../../helpers/requestHelper')
const { handleAxiosRequestConfig, checkIfGatewayApiKeyIsActive } = require('../../helpers/axiosHelper')
const { CustomError } = require("../../middlewares/errorHandlerMiddleware")
const {
    MSG_FAILURE_RETRIEVING_PROFILE_IMAGES,
    MSG_FAILURE_RETRIEVING_PROFILE_DATA} = require('../../messages/finder');
const {
    HTTP_SUCCESS_2XX,
    HTTP_CLIENT_ERROR_4XX} = require('../../helpers/httpCodes');
const {
    logInfo,
    logDebug,
    logWarning} = require('../../helpers/log/log');

const fillProfileWithPicture = async(headers, profileId, profileServiceBaseUrl) => {

    const {data: profileData, status: profileStatus} = await handleAxiosRequestConfig({
        method: 'GET',
        headers: headers,
        baseURL: profileServiceBaseUrl,
        url: `/user/profile/${profileId}`,
    })

    //logDebug(`On fill profile with picture: ${status} ${JSON.stringify(data)}`);
    const {data, status} = await handleAxiosRequestConfig({
        method: 'GET',
        headers: headers,
        baseURL: profileServiceBaseUrl,
        url: `/user/profile/pictures/${profileId}`,
    })

    if ( profileStatus != HTTP_SUCCESS_2XX.OK)
    {
        logInfo(`On fill profile with picture error: ${status} ${MSG_FAILURE_RETRIEVING_PROFILE_DATA}`);
        throw new CustomError(MSG_FAILURE_RETRIEVING_PROFILE_DATA, status);
    }     

    if ( status == HTTP_SUCCESS_2XX.OK || status == HTTP_CLIENT_ERROR_4XX.NOT_FOUND )
    {   
        const returnData = status == HTTP_CLIENT_ERROR_4XX.NOT_FOUND ? [] : data.pictures;
        logInfo(`On fill profile with picture return: ${status} ${JSON.stringify(data)}`);
        return {
            profileData,
            pictures: returnData,
        }
    }

    log(`On fill profile with picture error: ${status} ${MSG_FAILURE_RETRIEVING_PROFILE_IMAGES}`);
    throw new CustomError(MSG_FAILURE_RETRIEVING_PROFILE_IMAGES, status);
} 

const handler =  async (req, res, next) => {

    try {
        const matchServiceBaseUrl = getServiceStatus(SERVICES.MATCHES).target;

        const headers = parseHeaders(req);

        const {status, data} =  await handleAxiosRequestConfig({
            method: 'GET',
            headers: headers,
            baseURL: matchServiceBaseUrl,
            url: `/user/${req.query.profileId}/matchs`,
        })

        if (status != HTTP_SUCCESS_2XX.OK) {
            logInfo(`On handler (getCrushes) response: ${status} ${JSON.stringify(data)}`);
            return checkIfGatewayApiKeyIsActive(res, status, data);
        }

        const crushesProfilesIds = data.map( x => x.matched.userid != req.query.profileId ? x.matched.userid : x.myself.userid)

        const profileServiceBaseUrl = getServiceStatus(SERVICES.PROFILES).target;
        const crushes = await Promise.all(crushesProfilesIds.map(async (profileId) => await fillProfileWithPicture(headers, profileId, profileServiceBaseUrl)));
        
        logInfo(`On handler (getCrushes) response: ${axios.HttpStatusCode.Ok} ${JSON.stringify(crushes)}`);
        return checkIfGatewayApiKeyIsActive(res, axios.HttpStatusCode.Ok, {
            'ok': true,
            'data': crushes
        });

    }

    catch(exception) {
        logDebug(`On handler (getCrushes): ${JSON.stringify(exception)}`);
        next(exception);
    }
}

module.exports = { 
    handler,
}