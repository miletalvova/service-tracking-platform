import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize"

export class StatusHistory extends Model<InferAttributes<StatusHistory>, InferCreationAttributes<StatusHistory, { omit: "id" }>> {
    declare id: number;
    declare serviceRequestId: number;
    declare oldStatus: string;
    declare newStatus: string;
    declare changedAt: Date;
}

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