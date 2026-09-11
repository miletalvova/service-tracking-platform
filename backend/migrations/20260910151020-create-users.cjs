'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            FirstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            LastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            Email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            Username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            EncryptedPassword: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            RoleId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Roles',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Users');
    },
};
