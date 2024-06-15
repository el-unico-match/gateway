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
    const url_pictures = req.url.replace('/profile','/profile/pictures');
    const url_filter = req.url.replace('/profile','')+'/match/filter/';
    const url_match_profile = req.url.replace('/profile','')+'/match/profile/';

    await doChainRequestAxios(req, res, SERVICES.PROFILES, null, 
        async (req, res, data_perfil, status_perfil) => {
            if (status_perfil != HTTP_SUCCESS_2XX.OK)
                return {
                    status: status_perfil,
                    data: {
                        steperror: "get_userprofile",
                        errormsj: data_perfil
                    }
                };

            const {status: status_pictures, data: data_pictures} = 
                await sendRequestAxios(req, res, SERVICES.PROFILES, url_pictures);
            
            if (status_pictures != HTTP_SUCCESS_2XX.OK)
                return {
                    status: status_perfil,
                    data: {
                        ...data_perfil,
                        steperror: "get_pictures",
                        errormsj: data_pictures
                    }
                };
            
            const {status: status_filter, data: data_filter} = 
                await sendRequestAxios(req, res, SERVICES.MATCHES, url_filter);
            
            if (status_filter != HTTP_SUCCESS_2XX.OK)
                return {
                    status: status_perfil,
                    data: {
                        ...data_perfil,
                        pictures: data_pictures.pictures,
                        steperror: "get_getfilter",
                        errormsj: data_filter
                    }
                };
            
            const {status: status_match_profile, data: data_match_profile} = 
                await sendRequestAxios(req, res, SERVICES.MATCHES, url_match_profile);
            
            if (status_match_profile != HTTP_SUCCESS_2XX.OK)
                return {
                    status: status_perfil,
                    data: {
                        ...data_perfil,
                        pictures: data_pictures.pictures,
                        filter: data_filter,
                        steperror: "get_matchprofile",
                        errormsj: data_match_profile
                    }
                };

            return {
                status: status_perfil,
                data: {
                    ...data_perfil,
                    pictures: data_pictures.pictures,
                    filter: data_filter,
                    is_match_plus: data_match_profile.is_match_plus,
                    steperror: "",
                    errormsj: {}
                }
            };
        }, 
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