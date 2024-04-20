const {SERVICES} = require('../types/services');

class ServicesStatus {
    
    static _instance;

    matches;
    
    messages;

    profiles;

    users;

    constructor() {
        this.matches = {
            target: process.env.MATCHES_API_DOMAIN,
            active: false    
        };
        this.messages = {
            target: process.env.MESSAGES_API_DOMAIN,
            active: false    
        };
        this.profiles = {
            target: process.env.PROFILES_API_DOMAIN,
            active: false    
        };
        this.users = {
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

    getServices() {
        return {
            matches: this.matches,
            messages: this.messages,
            profiles: this.profiles,
            users: this.users
        }
    }
    
    start(service) {
        switch (service) {
            case SERVICES.MATCHES:
                this.matches.active = true;
                break;
            case SERVICES.MESSAGES:
                this.messages.active = true;
                break;
            case SERVICES.PROFILES:
                this.profiles.active = true;
                break;            
            case SERVICES.USERS:
                this.users.active = true;
                break;
        }
        return this.getService(service);
    }

    stop(service) {
        switch (service) {
            case SERVICES.MATCHES:
                this.matches.active = false;
                break;
            case SERVICES.MESSAGES:
                this.messages.active = false;
                break;
            case SERVICES.PROFILES:
                this.profiles.active = false;
                break;            
            case SERVICES.USERS:
                this.users.active = false;
                break;
        }
        return this.getService(service);
    }    
    
    getService(service) {
        switch (service) {
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

const getServicesStatus = () => {
    return ServicesStatus.getInstance().getServices();
}

const stopService = (service) => {
    return ServicesStatus.getInstance().stop(service);
}

const startService = (service) => {
    return ServicesStatus.getInstance().start(service);
}

const getServiceStatus = (service) => {
    return ServicesStatus.getInstance().getService(service);
}

module.exports = {
    getServiceStatus,
    getServicesStatus,
    startService,
    stopService
}