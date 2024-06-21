const axios  = require('axios');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const { handleAxiosRequestConfig} = require('../../helpers/axiosHelper')
const {SERVICES} = require('../../types/services');
const {MSG_FAILURE_RETRIEVING_PROFILE_IMAGES} = require('../../messages/finder');
const {CustomError} = require('../../middlewares/errorHandlerMiddleware');
const { logInfo, logWarning } = require('../../helpers/log/log');
const {
    HTTP_SUCCESS_2XX,
    HTTP_CLIENT_ERROR_4XX} = require('../../helpers/httpCodes');

const fillProfileWithPictures = async(profile, profileServiceBaseUrl) => {
    logDebug(`On fill profile with pictures, profile: ${JSON.stringify(profile)}`);
    logDebug(`On fill profile with pictures, profile service base url: ${JSON.stringify(profileServiceBaseUrl)}`);
    const {data, status} = await handleAxiosRequestConfig({
        method: 'GET',
        baseURL: profileServiceBaseUrl,
        url: `/user/profile/pictures/${profile.userid}`,
    })
    logDebug(`On fill profile with pictures: ${status} ${JSON.stringify(data)}`);
    if ( status == HTTP_SUCCESS_2XX.OK || status == HTTP_CLIENT_ERROR_4XX.NOT_FOUND )
    {   
        return {
            ...profile,
            pictures: status == HTTP_CLIENT_ERROR_4XX.NOT_FOUND ? [] : data.pictures,
        }
    }
    logInfo(`${MSG_FAILURE_RETRIEVING_PROFILE_IMAGES}: ${status}`);
    throw new CustomError(MSG_FAILURE_RETRIEVING_PROFILE_IMAGES, status);
} 

const handler =  async (req, res, next) => {

    try {
        const matchServiceBaseUrl = getServiceStatus(SERVICES.MATCHES).target;
        
        const {data, status} =  await handleAxiosRequestConfig({
            method: 'GET',
            baseURL: matchServiceBaseUrl,
            url: `/user/${req.query.profileId}/profiles/filter`,
            params: req.query,
        });

        if ( status == HTTP_SUCCESS_2XX.NO_CONTENT_TO_RETURN ) {
            logInfo(`On handler (get candidates) response: ${status} []`);
            return res
                .status(axios.HttpStatusCode.Ok)
                .json({
                    'ok': true,
                    'data': []
                })
        }

        if (status != HTTP_SUCCESS_2XX.OK) {
            logInfo(`On handler (get candidates) response: ${status} ${JSON.stringify(data)}`);
            return res.json(status).json(data);
        }

        const candidatesProfiles = [data];

        const profileServiceBaseUrl = getServiceStatus(SERVICES.PROFILES).target;
        const candidates = await Promise.all(candidatesProfiles.map(async (profile) => await fillProfileWithPictures(profile, profileServiceBaseUrl)));
        
        logInfo(`On handler (get candidates) response: ${status} ${JSON.stringify(candidates[0])}`);
        return res.status(axios.HttpStatusCode.Ok).json({
            'ok': true,
            'data': candidates[0]
        });
    }

    catch(exception)
    {
        logWarning(`On handler (get candidates) error: ${JSON.stringify(exception)}`);
        next(exception);
    }
}

module.exports = { handler }