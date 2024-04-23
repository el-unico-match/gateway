const {response} = require('express');
const axios = require('axios');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {HTTP_SERVER_ERROR_5XX} = require('./httpCodes');
/**
 * 
 * @param {*} result obtenido de una consulta por axios.
 * Procesa el resultado y el error parámetro respondiendo con el resultado si
 * no es nulo y con un mensaje de error interno del servidor en caso contrario.
 * 
 */
const processErrorAxiosRequest =  async (res = response, error) => {
    try {
        if (error.code === axios.AxiosError.ERR_BAD_REQUEST) {
            res.status(error.response.status).json({
                ok: false,
                msg: error.message                
            })
        } else {
            console.log(error.code);
            res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
                ok: false,
                msg: MSG_ERROR_500
            })
        }        
    } catch (error2) {
        console.log(error2);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
        
}

module.exports = {
    processErrorAxiosRequest
}