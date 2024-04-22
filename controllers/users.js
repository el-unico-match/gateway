const {response} = require('express');
const axios = require('axios');

const loginUser =  async (req, res = response) => {
    
    let url = getServiceStatus(SERVICES.USERS).target+'/api/auth';
    console.log(req.body);
    //console.log(req.header('x_token'));
    let resultado = await axios.get('https://users-uniquegroup-match-fiuba.azurewebsites.net/api/status');
    console.log(resultado);
    console.log(axios.isCancel('something'));
    //https://users-uniquegroup-match-fiuba.azurewebsites.net/api/status
    res.json({
        ok: true,
        service: getServiceStatus(SERVICES.USERS)
    })
}

const getDataUser = async (req, res = response) => {
    /*try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: MSG_ERROR_500
        });
    }*/
}



module.exports = {
    loginUser
}