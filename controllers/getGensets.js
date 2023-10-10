const axios = require('axios');
require("dotenv").config();
const criaLogin = require('./login.js');
const equipament = require('../dbfiles/equipaments.js');
const equipspec = require('../dbfiles/equipspecs.js');

async function getGensets(token) {
  let auvotoken = `Bearer ${token}`;

  const config = {
    method: 'GET',
    url: `https://api.auvo.com.br/v2/equipments?PageSize=500`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auvotoken,
    },
  };

  let contagem = 0

  try {
    const response = await axios(config);
    let gensets = response.data.result.entityList;

    for (let genset of gensets) {
      let auvoId = genset.id;

      //verifica se o equipamento já está cadastrado
      let verificacao = await equipament.findAll({
        where: {
          auvoId: auvoId
        }
      })

      console.log(verificacao)


 
      //cadastra o equipamento caso não esteja cadastrado
      if (verificacao.length === 0) {



        let clientAuvoId = genset.associatedCustomerId;
        let specs = genset.equipmentSpecifications;

        console.log(specs);

        let novoEquipamento = {
          auvoId: auvoId,
          clientAuvoId: clientAuvoId,
        };

        let newEquip = await equipament.create(novoEquipamento);
        let idEquip = newEquip.dataValues.id;

        for (let spec of specs) {
          let nomeSpec = spec.name;
          let valorSpec = spec.specification;

          console.info(`Esse é o nome da spec => ${nomeSpec}`);
          console.info(`Esse é o valor da spec => ${valorSpec}`);

          await equipspec.create({
            idEquip: idEquip,
            specName: nomeSpec,
            spec: valorSpec
          });
        }
        contagem = contagem + 1
      }  


    }
  } catch (error) {
    console.log(error);
  }

  console.log(`Total de cadastros => ${contagem}`)
}

async function iniciar() {
  try {
    let token = await criaLogin(); // Chama a função criaLogin para obter o token
    await getGensets(token);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  iniciar: iniciar,
};
