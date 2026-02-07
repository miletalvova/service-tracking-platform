import { Sequelize, DataTypes, Model } from "sequelize";
import type { InferAttributes, InferCreationAttributes } from "sequelize";
import type { User } from "./user.js";
import { ServiceRequest } from "./ServiceRequest.js";

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role, { omit: "id" }>> {
    declare id: number;
    declare Name: "Customer" |"Staff" |"Technician";
    declare Users?: User[];

    static associate(models: {User: typeof User}) {
        Role.hasMany(models.User, {
            foreignKey: "RoleId",
            as: "Users"
        });
    }
}

export function initRoleModel(sequelize: Sequelize) {
    Role.init (
        {
            id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    },
    {
        sequelize,
        timestamps: false
    });
}   
