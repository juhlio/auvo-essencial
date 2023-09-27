const Sequelize = require('sequelize');
const database = require('../db');

const equipspecs = database.define('equipspecs', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idEquip: Sequelize.INTEGER,
    specName: Sequelize.STRING,
    spec: Sequelize.STRING,
}, {
    timestamps: true, // Adiciona created_at e updated_at
    createdAt: 'created_at', // Personaliza o nome do campo created_at (opcional)
    updatedAt: 'updated_at' // Personaliza o nome do campo updated_at (opcional)
});

module.exports = equipspecs;
