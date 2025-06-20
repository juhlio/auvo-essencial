const axios = require('axios');
const products = require('../dbfiles/products');
require("dotenv").config()
const criaLogin = require('./login.js');


async function getProducts() {

    try {
        let products = await axios.get('https://painel.essencialenergia.com.br/api/listaprodutos')
        console.log(products.data)
        let allProducts = products.data
        return allProducts
    } catch (error) {
        console.log(`Erro ao realizar a chamada: ${error}`)
    }
}

async function sendProducts(token, name, externalId, description, categoryId, totalStock) {

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
        const response = await axios(config);
        console.log(response.data.result.code);
        let code = response.data.result.code;
        products.update({ idAuvo: code }, { where: { id: externalId } })
    } catch (error) {
        console.log(error);
    }


}



async function iniciar() {
    let all = await getProducts()
    let token = await criaLogin()

    for (let item of all) {
        await sendProducts(token, item.name, item.externalId, item.description, item.categoryId, item.totalStock);
    }

}




module.exports = {
    iniciar: iniciar,
};
