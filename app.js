
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

