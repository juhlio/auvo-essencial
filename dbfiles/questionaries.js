const Sequelize = require('sequelize');
const database = require('../db');

const questionaries = database.define('questionaries', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    taskId: Sequelize.INTEGER,
    equipId: Sequelize.INTEGER,
    questionId: Sequelize.INTEGER,
    questionDescription: Sequelize.STRING,
    replyId: Sequelize.INTEGER,
    reply: Sequelize.STRING,
}, {
    timestamps: true, // Adiciona created_at e updated_at
    createdAt: 'created_at', // Personaliza o nome do campo created_at (opcional)
    updatedAt: 'updated_at' // Personaliza o nome do campo updated_at (opcional)
});

module.exports = questionaries;
