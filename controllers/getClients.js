const axios = require('axios');
const clients = require('../dbfiles/clients.js')
require("dotenv").config()
const criaLogin = require('./login.js');



async function getClients(token, req, res) {
    let auvotoken = `Bearer ${token}`;



    const config = {
        method: 'GET',
        url: `https://api.auvo.com.br/v2/Customers?Page=1&PageSize=500&Order=Asc`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auvotoken,
        },
    };

    try {
        const response = await axios(config);
        //console.log(response.data.result);



        let clientes = response.data.result.entityList;
        console.log(clientes)

        for (let item of clientes) {
            console.log(`Esse é o CNPJ => ${item.cpfCnpj}`)
            console.log(`Esse é o ID => ${item.id}`)
            let idAuvocliente = item.id
            let cnpj = item.cpfCnpj
            clients.update({ idAuvo: idAuvocliente }, { where: { cnpjFormatado: cnpj } })
        }






    } catch (error) {
        console.log(error);
    }
}

async function iniciar() {
    let token = await criaLogin(); // Chama a função criaLogin para obter o token

    // Agora você pode chamar a função obterToken ou usar o token em outros lugares
    await getClients(token);
}


module.exports = {
    iniciar: iniciar,
};
