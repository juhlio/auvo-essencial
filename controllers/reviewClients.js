const axios = require("axios");
const clients = require("../dbfiles/clients.js");
require("dotenv").config();
const criaLogin = require("./login.js");

async function reviewClients(token, req, res) {
  let auvotoken = `Bearer ${token}`;

  const config = {
    method: "GET",
    url: `https://painel.essencialenergia.com.br/semclientes`,
  };

  try {
    const response = await axios(config);

    let clientes = response.data;

    for (let client of clientes) {
      let clientId = client.id;

      let config2 = {
        method: "GET",
        url: `https://api.auvo.com.br/v2/customers/${clientId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auvotoken,
        },
      };

      try {
        let response2 = await axios(config2);
      
        let razaoSocial = response2.data.result.description;
        let name = response2.data.result.description;
        let cnpj = response2.data.result.cpfCnpj;
        let endereco = response2.data.result.address;
        let idAuvo = clientId;

      
          // Se não existir, cria um novo registro
          await clients.create({
            razaoSocial: razaoSocial,
            nome: name,
            CNPJ: cnpj,
            cnpjFormatado: cnpj,
            endereco: endereco,
            idAuvo: idAuvo,
          });
          
          console.log("Novo cliente criado:", response2.data);
        
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function iniciar() {
  let token = await criaLogin();

  await reviewClients(token);
}

module.exports = {
  iniciar: iniciar,
};
