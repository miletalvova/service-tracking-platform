import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { Models } from "../types/model.types.js";

export class Status extends Model<InferAttributes<Status>, InferCreationAttributes<Status, { omit: "id" }>> {
    declare id: number;
    declare status: "created" | "assigned" | "in progress" | "completed" | "cancelled";

    static associate (models: Models) {
        Status.hasMany(models.ServiceRequest, {
            foreignKey: "statusId",
            as: "ServiceRequest"
        })
    }
}

export function initStatusModel(sequelize: Sequelize) {
    Status.init(
        {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        timestamps: false,
    });
} 