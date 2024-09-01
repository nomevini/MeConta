const express = require('express')
const cors = require('cors')
const routes = require('./src/routes/routes')
const app = express()

app.use(express.json())

// Configuração do CORS para permitir requisições do localhost
const corsOptions = {
  origin: 'http://localhost:3000', // Substitua pelo número de porta correto se for diferente
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};

app.use(cors(corsOptions));
app.use(routes)

app.listen(3000)