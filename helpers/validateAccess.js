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

/**
 * @param {id} object El id del usuario a checkear.
 * @returns Verdadero si el usuario tiene la propiedad del id, falso caso contrario.
 */
const checkAccessOwnershipBased = async (req, id) => {        
    try {
        const token = req.header('x-token');
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        let result = await instanceAxios.get('/current');
        try {
            if (result.data.msg.id !== id) {
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


/**
 * @returns Verdadero si el token del usuario es válido, falso caso contrario.
 */
const checkAccessValidToken = async (req) => {        
    try {
        const token = req.header('x-token');
        let url = getServiceStatus(SERVICES.USERS).target;
        const instanceAxios = axios.create({baseURL: url});
        instanceAxios.defaults.headers.common['x-token'] = token;
        let result = await instanceAxios.get('/token');
        try {
            return result.ok;
        } catch (error) {
            console.log(error);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    checkAccessRoleBased,
    checkAccessOwnershipBased,
    checkAccessValidToken
}