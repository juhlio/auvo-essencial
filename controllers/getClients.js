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
            

            let idAuvocliente = item.id
            let cnpj = item.cpfCnpj
            let cnpjOriginal = item.cpfCnpj.toString().replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
            
            let verClient = await clients.findAll({
                where: {
                    idAuvo: idAuvocliente
                }
            })
        
            if (verClient.length < 1) {

                //busca pelo cnpj
                let verCnpj = await clients.findAll({
                    where: {
                        cnpjFormatado: cnpj
                    }
                })
                
                if (verCnpj.length > 0 ){
                    clients.update({ idAuvo: idAuvocliente }, { where: { cnpjFormatado: cnpj } })
                }else{
                    
                    clients.create({
                        razaoSocial: item.description,
                        nome: item.description,
                        CNPJ: cnpjOriginal,
                        cnpjFormatado: cnpj,
                        endereco: item.address,
                        idAuvo: idAuvocliente
                        
                    })

                }

                
            }
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
