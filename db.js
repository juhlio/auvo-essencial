const Sequelize = require('sequelize')
require("dotenv").config()  // Carrega as variáveis de ambiente

const dbName = process.env.DB_NAME 
//const dbName = 'paineless' 
const dbUser = process.env.DB_USER
//const dbUser = 'root'
const dbPassword = process.env.DB_PASS
//const dbPassword = ''
const dbDialect = process.env.DB_DIALECT
const dbHost = process.env.DB_HOST
//const dbHost = 'localhost'
const dbPort = process.env.DB_PORT 


const sequelize = new Sequelize(dbName, dbUser, dbPassword,{
    dialect: dbDialect,
    host: dbHost,
    port: dbPort
}) 

module.exports = sequelize