const axios = require("axios");
require("dotenv").config();
const criaLogin = require("./login.js");
const tasks = require("../dbfiles/tasks.js");
const questionaries = require("../dbfiles/questionaries.js");
const semaphores = require("../dbfiles/semaphores.js");

async function getReports(token, reportId) {

  let auvotoken = `Bearer ${token}`;

  let endpoint = `https://api.auvo.com.br/v2/tasks/${reportId}`;

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
    let report = response.data.result;

    console.log(report)

      if (report.taskStatus == "5") {
        let taskId = report.taskID;
        let clientId = report.customerId;
        let type = report.taskTypeDescription;
        let obs = report.report;
        let taskType = report.taskType;
        let osUrl = report.taskUrl;
        let equipId = report.equipmentsId[0];

        let verifyTask = await tasks.findAll({
          where: {
            auvoId: taskId,
          },
        });

        console.log(verifyTask);

        if (verifyTask.length === 0) {
          let newTask = await tasks.create({
            auvoId: taskId,
            clientId: clientId,
            typeId: taskType,
            type: type,
            equipId: equipId,
            obs: obs,
            osUrl: osUrl,
          });

          console.log(newTask);

          let questionarie = report.questionnaires;
          let lastQuestionarie = questionarie[questionarie.length - 1];
          let answers = lastQuestionarie.answers;

          for (let answer of answers) {
            let questionId = answer.questionId;
            let questionDescription = answer.questionDescription;
            let replyId = answer.replyId;
            let reply = answer.reply;

            let newQuestionarie = await questionaries.create({
              taskId: taskId,
              questionId: questionId,
              equipId: equipId,
              questionDescription: questionDescription,
              replyId: replyId,
              reply: reply,
            });

            if (
              answer.questionDescription === "Status geral do gerador" ||
              answer.questionDescription === "STATUS GERAL DO GRUPO GERADOR"
            ) {
              if (equipId) {
                let deleteSemaphore = await semaphores.destroy({
                  where: { equipId: equipId },
                  limit: 1,
                  order: [["created_at", "DESC"]],
                });

                let nomeEquip = "";
                let buscaLocalizacao = {
                  method: "GET",
                  url: `https://api.auvo.com.br/v2/equipments/${equipId}`,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: auvotoken,
                  },
                };
                try {
                  let respostaLocalizacao = await axios(buscaLocalizacao);
                  let specs =
                    respostaLocalizacao.data.result.equipmentSpecifications;
                  for (let spec of specs) {
                    // Adicionado "let" antes de "spec"
                    if (spec.name === "TAG (Localizador)") {
                      nomeEquip = spec.specification;
                    }
                  }
                } catch (error) {}

                if (nomeEquip == "") {
                  nomeEquip = "G1";
                }

                let semaphore = await semaphores.create({
                  taskId: taskId,
                  equipId: equipId,
                  nomeEquip: nomeEquip,
                  questionId: questionId,
                  questionDescription: questionDescription,
                  replyId: replyId,
                  reply: reply,
                  obs: obs,
                });
              
            }
          }
        }
      } 
    } 
  } catch (error) {
    console.log(error);
  }
}

async function iniciar(reportId) {
  try {
    let token = await criaLogin();
    await getReports(token, reportId);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  iniciar: iniciar,
};
