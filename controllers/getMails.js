const axios = require('axios');
const clients = require('../dbfiles/clients.js');
const clientsMails = require('../dbfiles/clientsEmails.js');
require("dotenv").config();
const criaLogin = require('./login.js');

async function upClients(token) {
    let auvotoken = `Bearer ${token}`;
    
    try {
        let customers = await clients.findAll();
        
        for (let customer of customers) {
            const config = {
                method: 'GET',
                url: `https://api.auvo.com.br/v2/customers/${customer.idAuvo}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auvotoken,
                },
            };
            
            try {
                const response = await axios(config);
                let emails = response.data.result.email;

                for (let email of emails) {
                    let verifyEmail = await clientsMails.findAll({
                        where: {
                            auvoId: customer.idAuvo,
                            mail: email
                        },
                    });

                    if (verifyEmail.length === 0) {
                        console.log(`Novo email a ser criado: ${email}`);
                        
                        let clientId = await clients.findOne({
                            where: {
                                idAuvo: customer.idAuvo
                            }                   
                        })


                         await clientsMails.create({
                            clientId: clientId.dataValues.id,
                            auvoId: customer.idAuvo,
                            mail: email
                        }) 
                    
                    }

                   
                }

                // Commented out code for updating groups - add if needed
                /*
                let groups = response.data.result.groupsId;
                let client = await clients.findByPk(customer.id);
                
                if (client) {
                    let existingGroups = client.groups || '';
                    let newGroups = groups.join(', ');

                    let allGroups = existingGroups + (existingGroups && newGroups ? ', ' : '') + newGroups;
                    
                    await client.update({ groups: allGroups });
                    console.log(`Grupos atualizados para o cliente ${customer.idAuvo}`);
                } else {
                    console.log(`Cliente com IDAuvo ${customer.idAuvo} não encontrado no banco de dados`);
                }
                */
            } catch (error) {
                console.error(`Erro ao obter dados do cliente ${customer.idAuvo}:`, error);
            }
        }
    } catch (error) {
        console.error('Erro ao buscar clientes do banco de dados:', error);
    }
}

async function iniciar() {
    try {
        let token = await criaLogin(); // Chama a função criaLogin para obter o token
        await upClients(token);
    } catch (error) {
        console.error('Erro ao iniciar o processo:', error);
    }
}

module.exports = {
    iniciar: iniciar,
};
