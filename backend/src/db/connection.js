const { Sequelize } = require('sequelize');
require('dotenv').config()

// Pegar a URL do banco de dados das variáveis de ambiente
const databaseUrl = process.env.DATABASE_URL;

// Criar uma instância do Sequelize
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres', // Especifica que estamos usando PostgreSQL
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Aceita certificados auto-assinados
    },
  },
});

module.exports = sequelize;