import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { Models } from "../types/model.types.js";

export class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service, { omit: "id" }>> {
    declare id: number;
    declare serviceType: "Plumbing" | "Electrical" | "IT";
    declare description?: string;

    static associate (models: Models) {
        Service.hasMany(models.ServiceRequest, {
            foreignKey: "serviceId",
            as: "ServiceRequest"
        })
    }
}

export function initServiceModel(sequelize: Sequelize) {
    Service.init(
        {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
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
        sequelize,
        timestamps: false,
    });
} 