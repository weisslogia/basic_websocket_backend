const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('user', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {});
}