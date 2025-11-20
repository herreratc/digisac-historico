require('dotenv').config();
const express = require('express');
const historicoDigisacRoutes = require('./routes/historicoDigisac');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de histórico Digisac rodando 😎');
});

app.use('/historico-digisac', historicoDigisacRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
