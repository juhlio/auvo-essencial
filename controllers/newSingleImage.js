const axios = require('axios');
require("dotenv").config()
const criaLogin = require('./login.js');





async function sendImage(req, res, token) {

    const idEss = req.params.id;
    let auvotoken = `Bearer ${token}`;
    let image64;
    let idAuvo;

    try {
        let getId = await axios.get('https://painel.essencialenergia.com.br/api/produto/' + idEss)
        console.log(getId.data)
        idAuvo = getId.data.idAuvo
    } catch (error) {
        console.log(`Erro ao realizar a chamada: ${error}`)
    }


    try {
        let getImage = await axios.get('https://painel.essencialenergia.com.br/api/imagembase/' + idEss)
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

async function iniciar(req, res) {

    let token = await criaLogin()
    await sendImage(req, res, token);


}

module.exports = {
    iniciar: iniciar,
};