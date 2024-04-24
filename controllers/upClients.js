const axios = require('axios');
const clients = require('../dbfiles/clients.js')
require("dotenv").config()
const criaLogin = require('./login.js');

async function upClients(token, req, res) {
    let auvotoken = `Bearer ${token}`;
    
    let costumers = await clients.findAll();
    
    for (let costumer of costumers){
        const config = {
            method: 'GET',
            url: `https://api.auvo.com.br/v2/customers/${costumer.idAuvo}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auvotoken,
            },
        };
        
        try {
            const response = await axios(config);
            let groups = response.data.result.groupsId;

            // Concatenar os grupos retornados com os grupos existentes do cliente
            let cliente = await clients.findByPk(costumer.id); // Buscar o cliente pelo ID

            if (cliente) {
                let gruposExistente = cliente.groups || ''; // Grupos existentes do cliente
                let novosGrupos = groups.join(', '); // Novos grupos como string

                // Concatenar grupos existentes com novos grupos
                let todosGrupos = gruposExistente + (gruposExistente && novosGrupos ? ', ' : '') + novosGrupos;

                // Atualizar os grupos do cliente no banco de dados
                await cliente.update({ groups: todosGrupos });

                console.log(`Grupos atualizados para o cliente ${costumer.idAuvo}`);
            } else {
                console.log(`Cliente com IDAuvo ${costumer.idAuvo} não encontrado no banco de dados`);
            }
        } catch (error) {
            console.error('Erro ao atualizar grupos do cliente:', error);
        }
    }
}

async function iniciar() {
    let token = await criaLogin(); // Chama a função criaLogin para obter o token

    // Agora você pode chamar a função obterToken ou usar o token em outros lugares
    await upClients(token);
}

module.exports = {
    iniciar: iniciar,
};
