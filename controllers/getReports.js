const axios = require("axios");
require("dotenv").config();
const criaLogin = require("./login.js");
const tasks = require("../dbfiles/tasks.js");
const questionaries = require("../dbfiles/questionaries.js");
const semaphores = require("../dbfiles/semaphores.js");

async function getReports(token) {
  let agora = new Date();
  agora.setHours(agora.getHours() - 3);
  let dia = agora.getDate().toString().padStart(2, "0");
  let mes = (agora.getMonth() + 1).toString().padStart(2, "0");
  let ano = agora.getFullYear();

  
  let startDate = `${ano}-${mes}-${dia}`;
  let endDate = `${ano}-${mes}-${dia}`;

  let paramFilter = {
    startDate: startDate,
    endDate: endDate,
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

      if (report.taskStatus == "5") {
        let taskId = report.taskID;
        let clientId = report.customerId;
        let type = report.taskTypeDescription;
        let obs = report.report;
        let taskType = report.taskType;
        let osUrl = report.taskUrl;
        let equipId = report.equipmentsId[0];
        let taskDate = report.taskDate;

        let verifyTask = await tasks.findAll({
          where: {
            auvoId: taskId,
          },
        });

        console.log(verifyTask);

          let questionarie = report.questionnaires;
          let lastQuestionarie = questionarie[questionarie.length - 1];
          let answers = lastQuestionarie.answers;
          let idVerQuestion = answers[1].questionId;

          let verifyQuestion = await questionaries.findAll({
            where: {
              questionId: idVerQuestion
            }
          })

          if (verifyQuestion.length === 0) {

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

              console.log(`Questionario salvo no BD`)
  
            }

            
          } else {
            console.log(`Ja exists`)
          }

        
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