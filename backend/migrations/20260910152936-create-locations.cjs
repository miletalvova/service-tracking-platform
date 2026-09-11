'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Locations', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            city: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            state: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            zipCode: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Locations');
    },
};
