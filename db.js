const Sequelize = require('sequelize');
require("dotenv").config();  

const env = process.env.NODE_ENV || 'development';

let dbName, dbUser, dbPassword, dbDialect, dbHost, dbPort;

if (env === 'production') {
    dbName = process.env.PROD_DB_NAME;
    dbUser = process.env.PROD_DB_USER;
    dbPassword = process.env.PROD_DB_PASS;
    dbDialect = process.env.PROD_DB_DIALECT;
    dbHost = process.env.PROD_DB_HOST;
    dbPort = process.env.PROD_DB_PORT;
} else {
    dbName = process.env.DEV_DB_NAME;
    dbUser = process.env.DEV_DB_USER;
    dbPassword = process.env.DEV_DB_PASS;
    dbDialect = process.env.DEV_DB_DIALECT;
    dbHost = process.env.DEV_DB_HOST;
    dbPort = process.env.DEV_DB_PORT;
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    dialect: dbDialect,
    host: dbHost,
    port: dbPort
});

module.exports = sequelize;
