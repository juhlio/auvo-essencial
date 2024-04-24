const Sequelize = require('sequelize');
const database = require('../db');

const categories = database.define('clients', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    razaoSocial: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    nome: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    CNPJ: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    cnpjFormatado: {
        type: Sequelize.STRING(50),
        defaultValue: null,
    },
    classificacao: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    telefone: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    cep: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    endereco: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    bairro: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    cidade: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    uf: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    email: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    emailCobranca: {
        type: Sequelize.STRING(512),
        defaultValue: null,
    },
    idAuvo: {
        type: Sequelize.INTEGER,
        defaultValue: null,
    },
    groups: {
        type: Sequelize.INTEGER,
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
