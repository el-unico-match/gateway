const {SERVICES} = require('../types/services');

/**
 * Clase que resguarda el estado de cada uno de los servicios dado por
 * su estado lógico de activo o inactivo, su nombre y la URL target
 * del backend.
 */
class ServicesStatus {
    
    static _instance;

    matches;
    
    profiles;

    services;

    users;

    constructor() {
        this.matches = {
            name: SERVICES.MATCHES,
            target: process.env.MATCHES_API_DOMAIN,
        };
        this.profiles = {
            name: SERVICES.PROFILES,
            target: process.env.PROFILES_API_DOMAIN,
        };
        this.services = {
            name: SERVICES.SERVICES,
            target: process.env.SERVICES_API_DOMAIN,
        };
        this.users = {
            name: SERVICES.USERS,
            target: process.env.USERS_API_DOMAIN,
        };        
    }

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new ServicesStatus();
        return this._instance;
    }
        
    getService(serviceName) {
        switch (serviceName) {
            case SERVICES.MATCHES:
                return this.matches;
            case SERVICES.PROFILES:
                return this.profiles;
            case SERVICES.SERVICES:
                return this.services;
            case SERVICES.USERS:
                return this.users;
        }
    }
}

/**
 * 
 * @param {*} serviceName nombre del servicio.
 * @returns el estado del servicio en cuestión.
 */
const getServiceStatus = (serviceName) => {
    return ServicesStatus.getInstance().getService(serviceName);
}

module.exports = {
    getServiceStatus,
}