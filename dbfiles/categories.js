const Sequelize = require('sequelize');
const database = require('../db');

const categories = database.define('productscategories', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    descricao: Sequelize.STRING,
    idAuvo: Sequelize.INTEGER
}, {
    timestamps: true, // Adiciona created_at e updated_at
    createdAt: 'created_at', // Personaliza o nome do campo created_at (opcional)
    updatedAt: 'updated_at' // Personaliza o nome do campo updated_at (opcional)
});

module.exports = categories;
