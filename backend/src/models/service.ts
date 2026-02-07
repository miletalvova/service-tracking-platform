import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";

export class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service, { omit: "id" }>> {
    declare id: number;
    declare serviceType: string;
    declare description?: string;
}

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