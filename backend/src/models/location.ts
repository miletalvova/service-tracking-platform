import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { Models } from "../types/model.types.js";

export class Location extends Model<InferAttributes<Location>, InferCreationAttributes<Location, { omit: "id" }>> {
    declare id: number;
    declare address: string;
    declare city: string;
    declare state: string;
    declare zipCode: string;

    static associate(models: Models) {
        Location.hasMany(models.ServiceRequest, {
            foreignKey: "locationId",
            as: "ServiceRequest"
        }) 
    }
}

export function initLocationModel(sequelize: Sequelize) {
    Location.init(
        {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false
    });
}