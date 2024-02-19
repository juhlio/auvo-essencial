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
    //console.log(response.data.result);

    let clientes = response.data;
    console.log(response.data);

    for (let client of clientes) {
      console.log(client.id);

      let clientId = client.id;

      let config2 = {
        metho: "GET",
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

       /*  let cnpjOriginal = cnpj
          .toString()
          .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
        let cnpjFormatado = response2.data.cpfCnpj; */
        

        let endereco = response2.data.result.address;
        let idAuvo = clientId;

        clients.create({
          razaoSocial: razaoSocial,
          nome: name,
          CNPJ: cnpj,
          cnpjFormatado: cnpj,
          endereco: endereco,
          idAuvo: idAuvo,
        });

        console.log(response2.data);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function iniciar() {
  let token = await criaLogin(); // Chama a função criaLogin para obter o token

  // Agora você pode chamar a função obterToken ou usar o token em outros lugares
  await reviewClients(token);
}

module.exports = {
  iniciar: iniciar,
};
