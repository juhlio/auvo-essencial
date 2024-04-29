const axios = require('axios');
require("dotenv").config()
const criaLogin = require('./login.js');
const tasks = require("../dbfiles/tasks.js");

async function getOs(token) {

    let auvotoken = `Bearer ${token}`;

    let jobs = await tasks.findAll({
        where: {
            taskDate: null
        }
    });

    console.log(jobs)

    for (let job of jobs){

        
        const config = {
            method: 'GET',
            url: `https://api.auvo.com.br/v2/tasks/${job.auvoId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auvotoken,
            },
        };

        try {
            const response = await axios(config);
            console.log(response.data.result);

            await job.update({ taskDate: response.data.result.taskDate });


            
        } catch (error) {
            console.log(error);
        }



    }

}

async function iniciar() {

  let token =   await criaLogin(); // Chama a função criaLogin para obter o token
    // Agora você pode chamar a função obterToken ou usar o token em outros lugares
    await getOs(token);
}



module.exports = {
    iniciar: iniciar,
};
