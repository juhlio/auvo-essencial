const Sequelize = require('sequelize');
const database = require('../db');

const produtos = database.define('produtos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    descricao: Sequelize.STRING,
    fabricante: Sequelize.STRING,
    idTipo: Sequelize.INTEGER,
    tipo: Sequelize.STRING,
    codFabricante: Sequelize.STRING,
    codEan: Sequelize.STRING,
    ncm: Sequelize.STRING,
    unidadeMedida: Sequelize.STRING,
    localizacao: Sequelize.STRING,
    idAuvo: Sequelize.INTEGER,
    idRd: Sequelize.STRING,
}, {
    timestamps: true, // Adiciona created_at e updated_at
    createdAt: 'created_at', // Personaliza o nome do campo created_at (opcional)
    updatedAt: 'updated_at' // Personaliza o nome do campo updated_at (opcional)
});

module.exports = produtos;
