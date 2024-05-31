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
    const newUrl = req.url.replace('/profile','/profile/pictures');
    await  doChainRequestAxios(req, res, SERVICES.PROFILES, null, 
        async (req, res, data1, status1) => {
            const {status: status2, data: data2} = await sendRequestAxios(
                req, 
                res, 
                SERVICES.PROFILES, 
                newUrl);
            if (status1 === HTTP_SUCCESS_2XX.OK) {
                if (status2 === HTTP_SUCCESS_2XX.OK) {
                    return {
                        status: status2,
                        data: {
                            ...data1,
                            pictures: data2.pictures
                        }
                    };
                } else {
                    return {
                        status: status2,
                        data: data2
                    };
                };                    
            } else {
                return {
                    status: status1,
                    data: data1
                };
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