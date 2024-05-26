const axios  = require('axios'); 
const {query} = require('express-validator');
const {validateFields} = require('../../middlewares/validateFields');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {SERVICES} = require('../../types/services');
const {HTTP_SUCCESS_2XX} = require('../../helpers/httpCodes');

const requestValidation = [
    query('profileId', 'Is a required parameter.').isString(),
    validateFields
];

const fillProfileWithPicture = async(profile, profileServiceBaseUrl) => {
    let picture = undefined

    try {
        const {data} = await axios({
            method: 'GET',
            baseURL: profileServiceBaseUrl,
            url: `/user/profile/pictures/${profile.userid}`,
        })

        picture = data.pictures[0];
    }

    catch(e) {
        if ( e?.response?.status != 404){
            console.log(e)
            throw e;
        }
    }
    
    return {
        ...profile,
        picture,
    }
} 

const handler =  async (req, res) => {

    const matchServiceBaseUrl = getServiceStatus(SERVICES.MATCHES).target;
    const profileServiceBaseUrl = getServiceStatus(SERVICES.PROFILES).target;

    const {data: matchs} =  await axios({
        method: 'GET',
        baseURL: matchServiceBaseUrl,
        url: `/user/${req.query.profileId}/matchs`,
    })

    const matchUsersId = matchs
        .map( x => (x.userid_1 !== req.query.profileId) ? x.userid_1 : x.userid_2)
        .filter( x => x != null);

    const {data: profiles} =  await axios({
        method: 'GET',
        baseURL: profileServiceBaseUrl,
        url: '/users/profiles'
    })

    const crushesProfiles = profiles.filter( profile => profile.userId != req.query.profileId 
        && matchUsersId.some( userId => userId == profile.userid )) 

    const crushes = await Promise.all(crushesProfiles.map(async (profile) => await fillProfileWithPicture(profile, profileServiceBaseUrl)));

    res.status(HTTP_SUCCESS_2XX.OK).json({
        'ok': true,
        'data': crushes
    });
}

module.exports = { requestValidation, handler }