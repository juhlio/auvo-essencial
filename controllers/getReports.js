const axios = require('axios');
require("dotenv").config();
const criaLogin = require('./login.js');
const tasks = require('../dbfiles/tasks.js');
const questionaries = require('../dbfiles/questionaries.js');


async function getReports(token) {

    let auvotoken = `Bearer ${token}`;

    const config = {
        method: 'GET',
        url: `https://api.auvo.com.br/v2/tasks/?paramFilter={"startDate": "2023-09-01 T00:00:00",
        "endDate": "2023-09-30T23:59:59", "type":"117976"}&PageSize=100`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auvotoken,
        },
    };

    try {
        const response = await axios(config);
        let reports = response.data.result.entityList;

        console.log(reports[0])

        for (let report of reports) {
            let taskId = report.taskID;
            let clientId = report.customerId;
            let type = report.taskTypeDescription;

            let equipId = report.equipmentsId[0]


            let newTask = await tasks.create({
                auvoId: taskId,
                clientId: clientId,
                type: type,
                equipId: equipId
            })



            let questionarie = report.questionnaires;
            //pegar o ultimo questionaire
            let lastQuestionarie = questionarie[questionarie.length - 1];
            let answers = lastQuestionarie.answers;
            


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
                    reply: reply
                })

                //console.log(newQuestionarie)

            }



        }



        /*    let taskId = reports[0].taskID;
           let clientId = reports[0].customerId;
           let type = reports[0].taskTypeDescription;
   
           console.log(`Id da Task => ${taskId}`);
           console.log(`Id do Cliente => ${clientId}`);
           console.log(`Tipo de Tarefa => ${type}`)
   
           let newTask = await tasks.create({
               auvoId: taskId,
               clientId: clientId,
               type: type
           })
   
           console.log(newTask) */


        /* 
        
                let questionarie = reports[0].questionnaires;
                //pegar o ultimo questionaire
                let lastQuestionarie = questionarie[questionarie.length - 1];
                let answers = lastQuestionarie.answers;
                console.log(answers)
        
                for(answer of answers){
                    let questionId = answer.questionId;
                    let questionDescription = answer.questionDescription;
                    let replyId = answer.replyId;
                    let reply = answer.reply;
        
                    console.log(`Id da Pergunta => ${questionId}`);
                    console.log(`Descrição da Pergunta => ${questionDescription}`);
                    console.log(`Id da Resposta => ${replyId}`);
                    console.log(`Resposta => ${reply}`);
        
                    let newQuestionarie = await questionaries.create({
                        taskId: taskId,
                        questionId: questionId,
                        questionDescription: questionDescription,
                        replyId: replyId,
                        reply: reply
                    })
        
                    console.log(newQuestionarie)
        
                } */

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
