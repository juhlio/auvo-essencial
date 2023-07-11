const axios = require('axios');
require("dotenv").config()
const criaLogin = require('./login.js');

async function getTasks(token) {
    let auvotoken = `Bearer ${token}`;

    const config = {
        method: 'GET',
        url: `https://api.auvo.com.br/v2/tasks/?paramFilter={"startDate": "2023-07-01T00:00:00","endDate":"2023-07-30T00:00:00"}&pagSize=20&page=1`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auvotoken,
        },
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
  let token =   await criaLogin(); // Chama a função criaLogin para obter o token

    // Agora você pode chamar a função obterToken ou usar o token em outros lugares
    await getTasks(token);
}



module.exports = {
    iniciar: iniciar,
};
