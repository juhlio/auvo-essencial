const getTask = require('./controllers/getTasks')
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

/* app.get('/auvoapp', (req, res) => {
  getTask.iniciar(); // Executa a função iniciar apenas quando a rota for acessada
  res.send('Rota gettask executada com sucesso!');
});
 */