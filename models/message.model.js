const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('message', {
        sender: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        reciver: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {});
}