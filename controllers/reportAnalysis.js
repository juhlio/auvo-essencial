require("dotenv").config();
const questionarioes = require("../dbfiles/questionaries.js");
const ClientTaskReview = require("../dbfiles/clientTaskReview.js");
const Tasks = require("../dbfiles/tasks.js");
const axios = require("axios");
const { Op } = require("sequelize");

async function getTasksDoDia() {
  const inicioDia = new Date();
  inicioDia.setHours(0, 0, 0, 0);

  const fimDia = new Date();
  fimDia.setHours(23, 59, 59, 999);

  const tasks = await Tasks.findAll({
    where: {
      taskStatus: 5,
      taskDate: {
        [Op.between]: [inicioDia, fimDia]
      }
    }
  });

  return tasks;
}

async function getReportData(data) {
  let reportData = await questionarioes.findAll({
    where: {
      taskId: data,
    },
  });

  let cleanData = reportData.map((item) => {
    return {
      question: item.dataValues.questionDescription,
      answer: item.dataValues.reply,
    };
  });
  console.log("Dados limpos obtidos:", cleanData);
  return cleanData;
}

async function analysisForTheClient(taskId, cleanData) {
  const prompt = `
Você é um engenheiro especialista em manutenção de grupos geradores de energia. 
Receberá abaixo um conjunto de perguntas e respostas obtidas no checklist de manutenção.

Gere um laudo técnico detalhado e crítico com as seguintes características:
- Estruture a análise por sistemas (arrefecimento, combustível, lubrificação, elétrica, vibração, etc.);
- Valide cada resposta recebida;
- Identifique pontos positivos, eventuais indícios de desgaste, falhas incipientes ou riscos futuros;
- Gere observações preventivas e recomendações de ações preditivas;
- Identifique limitações da manutenção realizada;
- Utilize linguagem técnica, objetiva e profissional;
- Sempre conclua com um status geral do equipamento.

Checklist de manutenção:
${JSON.stringify(cleanData, null, 2)}
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Você é um engenheiro de manutenção de geradores. Sempre gere análises críticas." },
          { role: "user", content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.2
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const iaAnalysis = response.data.choices[0].message.content;

    console.log("Análise gerada para taskId:", taskId);

    await ClientTaskReview.create({
      task_id: taskId,
      raw_data: cleanData,
      ia_analysis: iaAnalysis,
      generated_by: 'gpt-4o'
    });

    console.log("Laudo salvo no banco de dados com sucesso.");
  } catch (error) {
    console.error("Erro ao chamar a API da OpenAI:", error.response ? error.response.data : error.message);
  }
}

async function iniciar() {
  const tasks = await getTasksDoDia();

  if (tasks.length === 0) {
    console.log("Nenhuma task encontrada com status 5 para o dia de hoje.");
    return;
  }

  for (const task of tasks) {
    const taskId = task.auvoId;

    // Verifica se já existe laudo no banco
    const existente = await ClientTaskReview.findOne({
      where: { task_id: taskId }
    });

    if (existente) {
      console.log(`TaskId ${taskId} já possui análise. Pulando...`);
      continue;
    }

    console.log(`Processando taskId: ${taskId}`);
    const cleanData = await getReportData(taskId);
    await analysisForTheClient(taskId, cleanData);
  }
}

module.exports = {
  iniciar: iniciar,
};
