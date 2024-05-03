const {response} = require('express');
const {SERVICES} = require('../../types/services');

/**
 * 
 * @returns El perfil del usuario asociado al id.
 */
const getUserProfile = async (req, res = response) => {
    
}

/**
 * @returns Los datos del usuarios actualizado.
 */
const updateUserProfile =  async (req, res = response) => {
    
}

/**
 * @returns Informe de borrado.
 */
const deleteUserProfile =  async (req, res = response) => {
   
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}