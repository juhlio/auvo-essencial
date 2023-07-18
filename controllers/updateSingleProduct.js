const axios = require('axios');
const products = require('../dbfiles/products');
const criaLogin = require('./login.js');


async function updateProduct(req, res, token) {

    //id do sistema essencial
    const idEss = req.params.id;
    let auvotoken = `Bearer ${token}`;
    let prodData
    //primeira requisição para api da essencial com os valores atualizados
    //painel.essencialenergia.com.br/api/produto/{id}
    let configEss = {
        method: 'GET',
        url: `https://painel.essencialenergia.com.br/api/produto/${idEss}`,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    try {
        const response = await axios(configEss);
        console.log(response.data);
        prodData = response.data;
    } catch (error) {
        console.log(error);
    }


    const config = {
        method: 'PATCH',
        url: `https://api.auvo.com.br/v2/products/${prodData.idAuvo}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auvotoken,
        },
        data: 

            [
                {
                    "op": "replace",
                    "path": "/name",
                    "value": prodData.descricao
                },
                {
                    "op": "replace",
                    "path": "/description",
                    "value": prodData.descricao
                },
            ]
        
    };

     try {
        const response = await axios(config);
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }


}


async function iniciar(req, res) {
    let token = await criaLogin()

    await updateProduct(req, res, token);

}


module.exports = {
    iniciar: iniciar,
};
