const {SERVICES} = require('../types/services');

class ServicesStatus {
    
    static _instance;

    matches;
    
    messages;

    profiles;

    users;

    constructor() {
        this.matches = {
            name: SERVICES.MATCHES,
            target: process.env.MATCHES_API_DOMAIN,
            active: true    
        };
        this.messages = {
            name: SERVICES.MESSAGES,
            target: process.env.MESSAGES_API_DOMAIN,
            active: true    
        };
        this.profiles = {
            name: SERVICES.PROFILES,
            target: process.env.PROFILES_API_DOMAIN,
            active: true    
        };
        this.users = {
            name: SERVICES.USERS,
            target: process.env.USERS_API_DOMAIN,
            active: true    
        };
    }

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new ServicesStatus();
        return this._instance;
    }
    
    setActive(serviceName, active) {
        switch (serviceName) {
            case SERVICES.MATCHES:
                this.matches.active = active;
                break;
            case SERVICES.MESSAGES:
                this.messages.active = active;
                break;
            case SERVICES.PROFILES:
                this.profiles.active = active;
                break;            
            case SERVICES.USERS:
                this.users.active = active;
                break;
        }
        return this.getService(serviceName);
    }
    
    getService(serviceName) {
        switch (serviceName) {
            case SERVICES.MATCHES:
                return this.matches;
            case SERVICES.MESSAGES:
                return this.messages;
            case SERVICES.PROFILES:
                return this.profiles;
            case SERVICES.USERS:
                return this.users;
        }
    }
}

const setServiceActive = (serviceName, active) => {
    return ServicesStatus.getInstance().setActive(serviceName, active);
}

const getServiceStatus = (serviceName) => {
    return ServicesStatus.getInstance().getService(serviceName);
}

module.exports = {
    getServiceStatus,
    setServiceActive
}