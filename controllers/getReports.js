const axios = require("axios");
require("dotenv").config();
const criaLogin = require("./login.js");
const tasks = require("../dbfiles/tasks.js");
const questionaries = require("../dbfiles/questionaries.js");
const semaphores = require("../dbfiles/semaphores.js");

async function getReports(token) {
  let agora = new Date();
  // Subtrair 3 horas
  agora.setHours(agora.getHours() - 3);
  let dia = agora.getDate().toString().padStart(2, "0");
  let mes = (agora.getMonth() + 1).toString().padStart(2, "0");
  let ano = agora.getFullYear();

  let startDate = `${ano}-${mes}-${dia}`;
  let endDate = `${ano}-${mes}-${dia}`;
  
  /*  let startDate = `2023-10-01`;
  let endDate = `2023-10-30`; */

  let paramFilter = {
    startDate: startDate,
    endDate: endDate,
  };

  let paramFilterString = JSON.stringify(paramFilter);

  let auvotoken = `Bearer ${token}`;

  let url = `https://api.auvo.com.br/v2/tasks/?paramFilter=${paramFilterString}&PageSize=100`;

  const config = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: auvotoken,
    },
  };

  try {
    const response = await axios(config);
    let reports = response.data.result.entityList;

    //abre laço para trabalhar cada relatorio
    for (let report of reports) {
      //abre verificacao do tipo de tarefa e status finalizado
      if (report.taskStatus == "5") {
        let taskId = report.taskID;
        let clientId = report.customerId;
        let type = report.taskTypeDescription;
        let obs = report.report;
        let taskType = report.taskType;

        let equipId = report.equipmentsId[0];

        let verifyTask = await tasks.findAll({
          where: {
            auvoId: taskId,
          },
        });

        if (verifyTask.length === 0) {
          //cria a nova task no bd
          let newTask = await tasks.create({
            auvoId: taskId,
            clientId: clientId,
            typeId: taskType,
            type: type,
            equipId: equipId,
          });

          let questionarie = report.questionnaires;
          //pegar o ultimo questionaire
          let lastQuestionarie = questionarie[questionarie.length - 1];
          let answers = lastQuestionarie.answers;

          //salva as respostas no banco
          for (answer of answers) {
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

            //salva resposta na tabela do semaforo
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
                //buscar a localicação do equipamento
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
                  for (spec of specs) {
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

      //fecha o laço para verificação de cada relatorio
    }
  } catch (error) {
    console.log(error);
  }
}

async function iniciar() {
  try {
    let token = await criaLogin(); // Chama a função criaLogin para obter o token
    await getReports(token);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  iniciar: iniciar,
};
