const axios = require('axios');
const categories = require('../dbfiles/categories');
require("dotenv").config()
const criaLogin = require('./login.js');



async function sendCategorie(req, res, token) {
    let externalId
    let description

    const idEss = req.params.id;
    const dataConfig = {
        method: 'GET',
        url: `https://painel.essencialenergia.com.br/api/categorie/${idEss}`,
    }

    try {
        const response = await axios(dataConfig);
        console.log(response.data);
        let catData = response.data
        externalId = catData.id
        description = catData.descricao
        

    } catch (error) {
        console.log(error);
    }




    let auvotoken = `Bearer ${token}`;

    const config = {
        method: 'POST',
        url: `https://api.auvo.com.br/v2/productCategories/`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auvotoken,
        },
        data: {
            "externalId": externalId,
            "description": description,
        }
    };
    try {
        const response2 = await axios(config);
        console.log(response2.data.result.code);
        let id = parseInt(response2.data.result.id);
        categories.update({ idAuvo: id }, { where: { id: externalId } })

    } catch (error) {
        console.log(error);
    }


}



async function iniciar(req, res) {

    let token = await criaLogin()
    await sendCategorie(req, res, token);

}




module.exports = {
    iniciar: iniciar,
};
