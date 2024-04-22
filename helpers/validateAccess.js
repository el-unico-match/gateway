const {SERVICES} = require('../types/services');
const {getServiceStatus} = require('../servicesStatus/servicesStatus');
const axios = require('axios');

/**
 * 
 * @param {superRole} object  Rol que puede tener acceso.
 * @returns Verdadero si el usuario tiene privilegio acceso, falso caso contrario.
 */
const checkAccessRoleBased = async (req, superRole) => {        
    try {
        const token = req.header('x-token');
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        let result = await instanceAxios.get('/current');
        try {
            if (result.data.msg.role !== superRole) {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

module.exports = {
    checkAccessRoleBased
}