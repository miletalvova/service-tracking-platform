import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { Models } from "../types/model.types.js";

export class StatusHistory extends Model<InferAttributes<StatusHistory>, InferCreationAttributes<StatusHistory, { omit: "id" }>> {
    declare id: number;
    declare serviceRequestId: number;
    declare oldStatus: string;
    declare newStatus: string;
    declare changedAt: Date;

    static associate(models: Models) {
        StatusHistory.belongsTo(models.ServiceRequest, {
            foreignKey: "serviceRequestId",
            as: "ServiceRequest"
        });
    }
}

export function initStatusHistoryModel(sequelize: Sequelize) {
    StatusHistory.init(
        {
        id: {
            type: DataTypes.INTEGER.UNSIGNED, 
            autoIncrement: true,
            primaryKey: true
        },
        serviceRequestId: {
            type: DataTypes.INTEGER.UNSIGNED,
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
        sequelize,
        timestamps: false
    });
}