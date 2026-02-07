import { Sequelize, DataTypes } from "sequelize"

export function initStatusHistoryModel(sequelize: Sequelize) {
    const StatusHistory = sequelize.define("StatusHistory", {
        id: {
            type: DataTypes.INTEGER, 
            autoIncrement: true,
            primaryKey: true
        },
        serviceRequestId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        oldStatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        newStatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        changedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    }); 

    return StatusHistory;
}