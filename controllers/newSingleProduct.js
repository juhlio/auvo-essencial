const axios = require('axios');
const products = require('../dbfiles/products');
require("dotenv").config()
const criaLogin = require('./login.js');



async function sendProduct(req, res, token) {
    let name
    let externalId
    let description
    let categoryId
    let totalStock

    const idEss = req.params.id;
    const dataConfig = {
        method: 'GET',
        url: `https://painel.essencialenergia.com.br/api/produto/${idEss}`,
    }

    try {
        const response = await axios(dataConfig);
        console.log(response.data);
        let prodData = response.data
        name = prodData.descricao
        externalId = prodData.id
        description = prodData.descricao
        categoryId = prodData.categoryId
        totalStock = prodData.totalEstoque


    } catch (error) {
        console.log(error);
    }




    let auvotoken = `Bearer ${token}`;

    const config = {
        method: 'POST',
        url: `https://api.auvo.com.br/v2/products/`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auvotoken,
        },
        data: {
            "name": name,
            "externalId": externalId,
            "description": description,
            "categoryId": categoryId,
            "totalStock": totalStock,
            "minimumStock": 1,
            "active": "true"
        }
    };
    try {
        const response2 = await axios(config);
        console.log(response2.data.result.code);
        let code = parseInt(response2.data.result.code);
        products.update({ idAuvo: code }, { where: { id: externalId } })

    } catch (error) {
        console.log(error);
    }


}



async function iniciar(req, res) {

    let token = await criaLogin()
    await sendProduct(req, res, token);

}




module.exports = {
    iniciar: iniciar,
};
