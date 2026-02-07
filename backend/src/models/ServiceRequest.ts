import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { User } from "./user.js";

export class ServiceRequest extends Model<InferAttributes<ServiceRequest>, InferCreationAttributes<ServiceRequest, { omit: "id" }>> {
    declare id: number;
    declare customerId: number;
    declare technicianId: number;
    declare serviceType: string;
    declare description?: string;
    declare status: "pending" | "assigned" | "completed";

    declare Customer?: User;
    declare Technician?: User;

    static associate(models: {User: typeof User}) {
        ServiceRequest.belongsTo(models.User, {
            foreignKey: "customerId",
            as: "Customer"
        });

        ServiceRequest.belongsTo(models.User, {
            foreignKey: "technicianId",
            as: "Technician"
        });
    }
}

export function initServiceRequestModel(sequelize: Sequelize) {
    ServiceRequest.init (
        {
            id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        technicianId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        serviceType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pending",
        }
    },
    {   sequelize,
        timestamps: true,
    });
}  