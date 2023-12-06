const axios = require("axios");
require("dotenv").config();
const equipament = require("../dbfiles/equipaments.js");
const equipspec = require("../dbfiles/equipspecs.js");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

async function resumeReports() {
  try {
    let url = `http://localhost/painelessencial/public/api/atendimentoauvo/34053330`;

    // Usando async/await para esperar a resposta da requisição fetch
    const response = await fetch(url);

    // Verifica se a resposta da solicitação é bem-sucedida (código 200)
    if (!response.ok) {
      throw new Error(`Erro ao acessar o link: ${response.status}`);
    }

    // Converte a resposta para JSON e a atribui a 'jsonData'
    const jsonData = await response.json();

    let questionsAndAnswers = "";

    // Itera sobre cada objeto na matriz
    for (const item of jsonData) {
      // Adiciona perguntas e respostas ao texto
      questionsAndAnswers += `Pergunta: ${item.questionDescription}\nResposta: ${item.reply}\n\n`;
    }



    // Faça o que quiser com os dados aqui
    let question = `Analise de forma resumida as condições de um gerador de energia baseado nas perguntas e respostas abaixo, destaque possiveis pontos de atenção com anormalidades e informações que possam causar falhas futuras no equipamento: ${questionsAndAnswers}`;

    

     const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: question }],
      model: "gpt-3.5-turbo",
    });

    
    console.log(chatCompletion.choices[0].message.content); 
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function iniciar() {
  await resumeReports();
}

module.exports = {
  iniciar: iniciar,
};
