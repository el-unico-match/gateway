const {SERVICES} = require('../types/services');
const MSG_OFFLINE_SERVICE = "The service is offline";
const MSG_ONLINE_SERVICE = "The service is online";
const MSG_SERVICE_ACTIVATED = "The service has been activated";
const MSG_SERVICE_DISABLED = "The service has been disabled";
const MSG_INVALID_SERVICE = `The service you have entered is not valid: ${Object.values(SERVICES)}`;
const MSG_SERVICE_REQUIRED = `You must enter a service: ${Object.values(SERVICES)}`;
const MSG_STATUS_REQUIRED = `You must enter a status: 1) active=true to start service 2) active=false to stop service`;

module.exports = {
    MSG_OFFLINE_SERVICE,
    MSG_ONLINE_SERVICE,
    MSG_SERVICE_ACTIVATED,
    MSG_SERVICE_DISABLED,
    MSG_INVALID_SERVICE,
    MSG_SERVICE_REQUIRED,
    MSG_STATUS_REQUIRED
}