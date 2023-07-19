const axios = require('axios');
require("dotenv").config()
const criaLogin = require('./login.js');


async function sycnStock(req, res, token) {

    const idEss = req.params.id;
    let auvotoken = `Bearer ${token}`;
    let idAuvo
    let totalStock


    try {
        let getId = await axios.get('https://painel.essencialenergia.com.br/api/produto/' + idEss)
        console.log(getId.data)
        idAuvo = getId.data.idAuvo
        totalStock = getId.data.totalEstoque
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
            "path": "totalStock",
            "value": totalStock


        }]
    };

    try {
        const response = await axios(config);
        console.log(response.data)
    } catch (error) {
        console.log(error);
    }


}


async function iniciar(req, res) {
    let token = await criaLogin()
    await sycnStock(req, res, token);

}



module.exports = {
    iniciar: iniciar,
};