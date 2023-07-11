const axios = require('axios');
require("dotenv").config()

let token; // Variável para armazenar o token

async function criaLogin() {
    let apiKey = process.env.API_KEY;
    let apiToken = process.env.API_TOKEN;

    try {
        const resposta = await axios.get(
            `https://api.auvo.com.br/v2/login/?apiKey=${apiKey}&apiToken=${apiToken}`
        );

        token = resposta.data.result.accessToken; // Armazena o token na variável
        return token; // Retorna o token
    } catch (erro) {
        console.error('Erro ao realizar chamada GET:', erro);
    }
}



async function getCategories() {

    try {
        let categories = await axios.get('https://painel.essencialenergia.com.br/api/listacategoriasprodutos')
        console.log(categories.data)
        let allCategories = categories.data
        return allCategories
    } catch (error) {
        console.log(`Erro ao realizar a chamada: ${error}`)
    }
}

async function sendCategories(token, id, descr) {

    let auvotoken = `Bearer ${token}`;

    const config = {
        method: 'POST',
        url: `https://api.auvo.com.br/v2/productCategories/`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auvotoken,
        },
        data: {
            "description": descr,
            "externalId": id
        }
    };

    try {
        const response = await axios(config);
        console.log(response.data.result.links);
        console.log(response.data.result.entityList);
    } catch (error) {
        console.log(error);
    }


}



async function iniciar() {
    let all = await getCategories()
    let token = await criaLogin()

    for (let item of all) {
        await sendCategories(token, item.id, item.descricao);
    }

}




module.exports = {
    iniciar: iniciar,
};
