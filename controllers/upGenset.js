const axios = require("axios");
require("dotenv").config();
const criaLogin = require("./login.js");
const equipament = require("../dbfiles/equipaments.js");
const equipspec = require("../dbfiles/equipspecs.js");

async function getGensets(token) {
  let auvotoken = `Bearer ${token}`;

  let equipamentNoId = await equipament.findAll({
    where: {
      clientAuvoId: "0",
    },
  });

  for (let item of equipamentNoId) {
    let auvoId = item.auvoId;

    const config = {
      method: "GET",
      url: `https://api.auvo.com.br/v2/equipments/${auvoId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: auvotoken,
      },
    };

    try {
      const response = await axios(config);
      let genset = response.data.result;

      let clientId = genset.associatedCustomerId;

      await equipament.update(
        { clientAuvoId: clientId },
        {
          where: {
            auvoId: auvoId,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

async function iniciar() {
  try {
    let token = await criaLogin();
    await getGensets(token);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  iniciar: iniciar,
};
