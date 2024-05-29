const axios  = require('axios'); 
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {SERVICES} = require('../../types/services');
const { handleAxiosRequestConfig } = require('../../helpers/axiosHelper')
const { CustomError } = require("../../middlewares/errorHandlerMiddleware") 

const fillProfileWithPicture = async(profile, profileServiceBaseUrl) => {

    const {data, status} = await handleAxiosRequestConfig({
        method: 'GET',
        baseURL: profileServiceBaseUrl,
        url: `/user/profile/pictures/${profile.userid}`,
    })

    if ( status == 200 || status == 404 )
    {   
        return {
            ...profile,
            picture: status == 404 ? undefined : data.pictures[0],
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

        crushesProfiles = Array.isArray(data) ? data : [data];

        const profileServiceBaseUrl = getServiceStatus(SERVICES.PROFILES).target;
        const crushes = await Promise.all(crushesProfiles.map(async (profile) => await fillProfileWithPicture(profile, profileServiceBaseUrl)));

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