const {HTTP_SUCCESS_2XX} = require('../helpers/httpCodes');
const {
    doRequestAxios,
    doChainRequestAxios,
    sendRequestAxios
} = require('../helpers/axiosHelper');
const {SERVICES} = require('../types/services');

/**
 * @returns Respuesta de la solicitud http
 */
const current = async (req, res) => {
    doRequestAxios(req, res, SERVICES.USERS);
}

/**
 * @returns Respuesta de la solicitud http
 */
const match_filter = async (req, res) => {
    doRequestAxios(req, res, SERVICES.MATCHES);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.USERS);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_id = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.USERS);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_id_match = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.MATCHES);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_id_matchs = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.MATCHES);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_match = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.MATCHES);
}

/**
 * @returns Respuesta de la solicitud http
 */
const user_profile = async (req, res) => {
    await doRequestAxios(req, res, SERVICES.PROFILES);
}

/**
 * @returns Respuesta de la solicitud http
 */
const get_user_profile_pictures = async (req, res = response) => {
    const url_filter        = req.url.replace('/profile','/match/filter');
    const url_match_profile = req.url.replace('/profile','/match/profile');
    const url_pictures      = req.url.replace('/profile','/profile/pictures');

    await doChainRequestAxios(req, res, SERVICES.PROFILES, null, 
        async (req, res, data_perfil, status_perfil) => {
            if (status_perfil != HTTP_SUCCESS_2XX.OK)
                return {
                    status: status_perfil,
                    data: data_perfil
                };

            const {status: status_pictures, data: data_pictures} = 
                await sendRequestAxios(req, res, SERVICES.PROFILES, url_pictures);
            
            if (status_pictures != HTTP_SUCCESS_2XX.OK)
                return {
                    status: status_pictures,
                    data: data_pictures
                };

            return {
                status: status_pictures,
                data: {
                    ...data_perfil,
                    pictures: data_pictures.pictures
                }
            };     
        }
    );
}

module.exports = {
    current,
    user,
    user_id,
    user_id_match, 
    user_id_matchs, 
    user_match,
    user_profile,
    get_user_profile_pictures,
    match_filter,
}