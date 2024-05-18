const {response} = require('express');
const {doRequestAxios} = require('../helpers/axiosHelper');
const {parseRequest} = require('../helpers/requestHelper');
 
/**
 * @returns Respuesta de la solicitud http
 */
/*const allApi =  async (req, res = response) => {
    let {
        method,
        headers,
        body,
        params,
        endpoint,
        url
    } = parseRequest(req);
    doRequestAxios(method, url, headers, body, params, endpoint, res);
}*/

const user =  async (req, res = response) => {
    console.log('user');
}

const user_profile =  async (req, res = response) => {
    console.log('user_profile');
}

module.exports = {
  //  allApi
  user,
  user_profile
}