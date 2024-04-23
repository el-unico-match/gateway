/**
 * Servicios válidos.
 */
const SERVICES = Object.freeze({
    MESSAGES: "mensajes",
    MATCHES: "matches",
    PROFILES: "perfiles", 
    USERS: "usuarios"    
});

/**
 * 
 * @param {String} role 
 * @returns Verdadero si el parámetro "serviceName" es un servicio válido.
 */
const isService = (serviceName) => {
    switch (serviceName) {
        case SERVICES.MATCHES:
            return true;    
        case SERVICES.MESSAGES:
            return true;   
        case SERVICES.PROFILES:
            return true;   
        case SERVICES.USERS:
            return true;   
        default:
            return false;
    }
}

module.exports = {
    SERVICES,
    isService
}