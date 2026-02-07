import { Sequelize, DataTypes } from "sequelize";

export function initServiceModel(sequelize: Sequelize) {
    const Service = sequelize.define("Service", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        serviceType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {
        timestamps: true,
    });

    return Service;
} 