const { Sequelize } = require('sequelize');
const db = require('../database');

const Teacher = db.define('teacher', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
});

module.exports = Teacher;
