const Sequelize = require('sequelize');
const database = require('../db');

const tasks = database.define('tasks', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    auvoId: Sequelize.INTEGER,
    clientId: Sequelize.INTEGER,
    equipId: Sequelize.INTEGER,
    typeId: Sequelize.INTEGER,
    type: Sequelize.STRING,
    obs: Sequelize.STRING,
    osurl: Sequelize.STRING,
    taskDate: Sequelize.DATE,
    taskStatus: Sequelize.STRING
}, {
    timestamps: true, // Adiciona created_at e updated_at
    createdAt: 'created_at', // Personaliza o nome do campo created_at (opcional)
    updatedAt: 'updated_at' // Personaliza o nome do campo updated_at (opcional)
});

module.exports = tasks;
