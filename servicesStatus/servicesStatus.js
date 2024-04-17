let users = {
    target: process.env.USERS_API_DOMAIN,
    online: true    
};

getServicesStatus = () => {
    return {
        users: users
    }
}

stopUsers = () => {
    users = {
        target: users.target,
        online: false
    };
}

startUsers = () => {
    users = {
        target: users.target,
        online: true
    };
}

getUsersService = () => {
    return users;
}

module.exports = {
    getServicesStatus,
    stopUsers,
    startUsers,
    getUsersService
}
// transformar esto en un singleton