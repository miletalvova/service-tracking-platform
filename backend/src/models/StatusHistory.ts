import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { Models } from "../types/model.types.js";

export class StatusHistory extends Model<InferAttributes<StatusHistory>, InferCreationAttributes<StatusHistory, { omit: "id" }>> {
    declare id: number;
    declare serviceRequestId: number;
    declare oldStatusId: number;
    declare newStatusId: number;
    declare changedAt: Date;

    static associate(models: Models) {
        StatusHistory.belongsTo(models.ServiceRequest, {
            foreignKey: "serviceRequestId",
            as: "ServiceRequest"
        });
        StatusHistory.belongsTo(models.Status, {
            foreignKey: "oldStatusId",
            as: "OldStatus"
        });
        StatusHistory.belongsTo(models.Status, {
            foreignKey: "newStatusId",
            as: "NewStatus"
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
        oldStatusId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        newStatusId: {
            type: DataTypes.INTEGER.UNSIGNED,
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