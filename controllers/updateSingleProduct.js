const axios = require('axios');
const products = require('../dbfiles/products');
const criaLogin = require('./login.js');


async function updateProduct(req, res, token){

    //id do sistema essencial
    const id = req.params.id;
    let auvotoken = `Bearer ${token}`;

    //primeira requisição para api da essencial com os valores atualizados
    // painel.essencialenergia.com.br/api/produto/{id}

    
    const config = {
        method: 'PATCH',
        url: `https://api.auvo.com.br/v2/products/${id}`,
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


}


async function iniciar(){
    let token = await criaLogin()


}