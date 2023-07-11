const axios = require('axios');
require("dotenv").config()
const criaLogin = require('./login.js');




async function getProducts() {

    try {
        let products = await axios.get('https://painel.essencialenergia.com.br/api/listaprodutos')
        /* console.log(products.data) */
        let allProducts = products.data
        return allProducts
    } catch (error) {
        console.log(`Erro ao realizar a chamada: ${error}`)
    }
}


async function sendImages(token, idAuvo, externalId) {

    let auvotoken = `Bearer ${token}`;
    let image64;
    try {
        let getImage = await axios.get('https://painel.essencialenergia.com.br/api/imagembase/' + externalId)
        image64 = getImage.data.base64
    } catch (error) {
        console.log(`Erro ao realizar a chamada: ${error}`)
    }


    const config = {
        method: 'PATCH',
        url: `https://api.auvo.com.br/v2/products/${idAuvo}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auvotoken,
        },
        data: [{

            "op": "replace",
            "path": "Base64Image",
            "value": `image/jpeg;base64, ${image64}`


        }]
    };

    try {
        const response = await axios(config);
        console.log(image64)
        console.log(response.data.result.code);
    } catch (error) {
        console.log(error);
    }


}

async function iniciar() {
    let all = await getProducts()
    let token = await criaLogin()

    for (let item of all) {
        await sendImages(token, item.codeAuvo, item.externalId);
    }

}

module.exports = {
    iniciar: iniciar,
};