const axios = require('axios');
const {response} = require('express');
const {header, query} = require('express-validator');
const {validateFields} = require('../../middlewares/validateFields');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {SERVICES} = require('../../types/services');
const {HTTP_SUCCESS_2XX} = require('../../helpers/httpCodes');
const {customValidateJwt} = require('../../middlewares/validateJWT')

const requestValidation = [
    header('x-token', 'Is a required header.').custom(customValidateJwt),
    query('profileId', 'Is a required parameter.').isString(),
    query('gender', 'Is an optional parameter.').optional().isString(),
    query('age', 'Is a required parameter.').optional().isString(),
    query('education', 'Is a required parameter.').optional().isString(),
    query('ethniticity', 'Is a required parameter.').optional().isString(),
    validateFields
];

const fillProfileWithPictures = async(profile, profileServiceBaseUrl) => {
    let pictures = []

    try {
        const {data} = await axios({
            method: 'GET',
            baseURL: profileServiceBaseUrl,
            url: `/user/profile/pictures/${profile.userid}`,
        })

        pictures = data.pictures;
    }

    catch(e) {
        if ( e?.response?.status != 404){
            console.log(e)
            throw e;
        }
    }
    
    return {
        ...profile,
        pictures,
    }
} 

const handler =  async (req, res = response) => {

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

    const candidatesProfile = profiles.filter( profile => profile.userId != req.query.profileId && matchUsersId.some( userId => userId == profile.userid ) == false) 

    const candidates = await Promise.all(candidatesProfile.map(async (profile) => await fillProfileWithPictures(profile, profileServiceBaseUrl)));

    res.status(HTTP_SUCCESS_2XX.OK).json({
        'ok': true,
        'data': candidates
    });
}

module.exports = { requestValidation, handler }