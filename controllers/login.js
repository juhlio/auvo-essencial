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


module.exports = criaLogin;