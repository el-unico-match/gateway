const axios  = require('axios'); 
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {SERVICES} = require('../../types/services');
const { handleAxiosRequestConfig } = require('../../helpers/axiosHelper')
const { CustomError } = require("../../middlewares/errorHandlerMiddleware") 

const fillProfileWithPicture = async(profileId, profileServiceBaseUrl) => {

    const {data: profileData, status: profileStatus} = await handleAxiosRequestConfig({
        method: 'GET',
        baseURL: profileServiceBaseUrl,
        url: `/user/profile/${profileId}`,
    })

    const {data, status} = await handleAxiosRequestConfig({
        method: 'GET',
        baseURL: profileServiceBaseUrl,
        url: `/user/profile/pictures/${profileId}`,
    })

    if ( profileStatus != 200)
    {
        throw new CustomError('Failure retrieving profile data.', profileStatus);
    }     

    if ( status == 200 || status == 404 )
    {   
        return {
            profileData,
            pictures: status == 404 ? [] : data.pictures,
        }
    }

    throw new CustomError('Failure retrieving profile images.', status);
} 

const handler =  async (req, res, next) => {

    try {
        const matchServiceBaseUrl = getServiceStatus(SERVICES.MATCHES).target;

        const {status, data} =  await handleAxiosRequestConfig({
            method: 'GET',
            baseURL: matchServiceBaseUrl,
            url: `/user/${req.query.profileId}/matchs`,
        })

        if (status != 200) {
            return res.status(status).json(data);
        }

        const crushesProfilesIds = data.map( x => x.matched.userid != req.query.profileId ? x.matched.userid : x.myself.userid)

        const profileServiceBaseUrl = getServiceStatus(SERVICES.PROFILES).target;
        const crushes = await Promise.all(crushesProfilesIds.map(async (profileId) => await fillProfileWithPicture(profileId, profileServiceBaseUrl)));

        return res.status(axios.HttpStatusCode.Ok).json({
            'ok': true,
            'data': crushes
        });

    }

    catch(exception) {
        console.log(exception);
        const error = typeof exception === 'CustomError' ? exception 
            : new CustomError(message="Failure retrieving matchs.", statusCode=axios.HttpStatusCode.InternalServerError);
        next(error);
    }
}

module.exports = { 
    handler,
}