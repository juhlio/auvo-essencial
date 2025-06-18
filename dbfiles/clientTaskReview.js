const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const ClientTaskReview = sequelize.define('clientTaskReview', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  raw_data: {
    type: DataTypes.JSON,
    allowNull: false
  },
  ia_analysis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  generated_by: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'clientTaskReview',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ClientTaskReview;
