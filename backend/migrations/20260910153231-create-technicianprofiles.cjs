'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('TechnicianProfiles', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            userId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                unique: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            skills: {
                type: Sequelize.STRING(500),
                allowNull: false,
                defaultValue: '',
                comment: 'Comma-separated list of skills',
            },

            isAvailable: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            currentLocationId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
                defaultValue: null,
                references: {
                    model: 'Locations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            maxActiveJobs: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 3,
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('TechnicianProfiles');
    },
};
