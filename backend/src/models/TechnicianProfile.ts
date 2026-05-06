import { Sequelize, Model, DataTypes, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { Models } from "../types/model.types.js";
import type { User } from "./user.js";
import type { Location } from "./location.js";

export class TechnicianProfile 
extends Model<InferAttributes<TechnicianProfile>, InferCreationAttributes<TechnicianProfile, { omit: "id" }>> {
    declare id: number;
    declare userId: number;
    declare skills: string;
    declare isAvailable: boolean;
    declare currentLocationId: number | null;
    declare maxActiveJobs: number;

    declare User?: User;
    declare CurrentLocation?: Location;

    static associate(models: Models) {
        TechnicianProfile.belongsTo(models.User, {
            foreignKey: "userId",
            as: "User"
        });
        TechnicianProfile.belongsTo(models.Location, {
            foreignKey: "currentLocationId",
            as: "CurrentLocation"
        });
    }
}
export function initTechnicianProfileModel(sequelize: Sequelize) {
    TechnicianProfile.init (
        {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: true
        },
        skills: {
            type: DataTypes.STRING(500),
            allowNull: false,
            defaultValue: "",
            comment: "Comma-separated list of skills"
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        currentLocationId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: null
        },
        maxActiveJobs: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 3
        }
    }, {
        sequelize,
        timestamps: true,
    });
}