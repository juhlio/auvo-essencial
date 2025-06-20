const axios = require("axios");
require("dotenv").config();
const criaLogin = require("./login.js");
const tasks = require("../dbfiles/tasks.js");


async function getReports(token, initDate) {
  let lastDate = parseInt(initDate) + 5;

  let agora = new Date();
  agora.setHours(agora.getHours() - 3);

  let dia = agora.getDate().toString().padStart(2, "0");
  let mes = (agora.getMonth() + 1).toString().padStart(2, "0");
  let ano = agora.getFullYear();

  let startDate = `${ano}-${mes}-${dia}`;
  //let startDate = `2024-05-25`;

  let paramFilter = {
    startDate: `${ano}-01-01`,
    endDate: `${ano}-12-31`,
    dateLastUpdate: `${startDate}`,
  };

  let paramFilterString = JSON.stringify(paramFilter);

  let auvotoken = `Bearer ${token}`;

  let endpoint = `https://api.auvo.com.br/v2/tasks/?paramFilter=${paramFilterString}&PageSize=100`;

  const config = {
    method: "GET",
    url: endpoint,
    headers: {
      "Content-Type": "application/json",
      Authorization: auvotoken,
    },
  };

  try {
    const response = await axios(config);
    let reports = response.data.result.entityList;

    for (let report of reports) {
      

      let taskId = report.taskID;
      let clientId = report.customerId;
      let type = report.taskTypeDescription;
      let obs = report.report;
      let taskType = report.taskType;
      let osUrl = report.taskUrl;
      let equipId = report.equipmentsId[0];
      let taskDate = report.taskDate;
      let taskStatus = report.taskStatus;

      let verifyTask = await tasks.findAll({
        where: {
          auvoId: taskId,
        },
      });

      console.log(`url: ${osUrl} | reportlink: ${report.taskUrl}`);

      if (verifyTask.length === 0) {
        let newTask = await tasks.create({
          auvoId: taskId,
          clientId: clientId,
          typeId: taskType,
          type: type,
          equipId: equipId,
          obs: obs,
          osurl: osUrl,
          taskDate: taskDate,
          taskStatus: taskStatus,
        });

        
      } else {
        await tasks.update(
          {
            clientId: clientId,
            clientId: clientId,
            typeId: taskType,
            type: type,
            equipId: equipId,
            obs: obs,
            osUrl: osUrl,
            taskDate: taskDate,
          },
          {
            where: {
              auvoId: taskId,
            },
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function iniciar() {
  try {
    let token = await criaLogin();
    await getReports(token);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  iniciar: iniciar,
};
