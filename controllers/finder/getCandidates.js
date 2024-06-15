const axios  = require('axios');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const { handleAxiosRequestConfig} = require('../../helpers/axiosHelper')
const {SERVICES} = require('../../types/services');
const { CustomError } = require('../../middlewares/errorHandlerMiddleware');

const fillProfileWithPictures = async(profile, profileServiceBaseUrl) => {

    const {data, status} = await handleAxiosRequestConfig({
        method: 'GET',
        baseURL: profileServiceBaseUrl,
        url: `/user/profile/pictures/${profile.userid}`,
    })

    if ( status == 200 || status == 404 )
    {   
        return {
            ...profile,
            pictures: status == 404 ? [] : data.pictures,
        }
    }

    throw new CustomError('Failure retrieving profile images.', status);
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

        if ( status == 204 ) {
            return res
                .status(axios.HttpStatusCode.Ok)
                .json({
                    'ok': true,
                    'data': []
                })
        }

        if (status != 200) {
            return res.json(status).json(data);
        }

        const candidatesProfiles = [data];

        const profileServiceBaseUrl = getServiceStatus(SERVICES.PROFILES).target;
        const candidates = await Promise.all(candidatesProfiles.map(async (profile) => await fillProfileWithPictures(profile, profileServiceBaseUrl)));
    
        return res.status(axios.HttpStatusCode.Ok).json({
            'ok': true,
            'data': candidates[0]
        });
    }

    catch(exception)
    {
        console.log(exception);
        const error = typeof exception === 'CustomError' ? exception 
            : new CustomError(message="Failure retrieving candidates.", statusCode=axios.HttpStatusCode.InternalServerError);
        next(error);
    }
}

module.exports = { handler }