const Sequelize = require('sequelize');
const database = require('../db');

const categories = database.define('clientesemails', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    clientId: {
        type: Sequelize.INTEGER,
        defaultValue: null,
    },
    auvoId: {
        type: Sequelize.INTEGER,
        defaultValue: null,
    },
    mail: {
        type: Sequelize.STRING(100),
        defaultValue: null,
    }, 
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
},
    {
        timestamps: true, // Adiciona created_at e updated_at
        createdAt: 'created_at', // Personaliza o nome do campo created_at (opcional)
        updatedAt: 'updated_at' // Personaliza o nome do campo updated_at (opcional)
    });

module.exports = categories;
