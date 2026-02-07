import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";

export class Location extends Model<InferAttributes<Location>, InferCreationAttributes<Location, { omit: "id" }>> {
    declare id: number;
    declare address: string;
    declare city: string;
    declare state: string;
    declare zipCode: string;
}

export function initLocationModel(sequelize: Sequelize) {
    const Location = sequelize.define("Location", {
        id: {
            type: DataTypes.INTEGER,
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
        timestamps: false
    });

    return Location;
}