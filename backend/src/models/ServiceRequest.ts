import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { User } from "./user.js";
import type { Models } from "../types/model.types.js";
import type { JobAssignment } from "./JobAssignment.js";

export class ServiceRequest extends Model<InferAttributes<ServiceRequest>, InferCreationAttributes<ServiceRequest, { omit: "id" }>> {
    declare id: number;
    declare customerId: number;
    declare serviceId: string;
    declare status: "created" | "assigned" | "in progress" | "completed" | "cancelled";
    declare location: string;

    declare Customer?: User;
    declare JobAssignments?: JobAssignment[];

    static associate(models: Models) {
        ServiceRequest.belongsTo(models.User, {
            foreignKey: "customerId",
            as: "Customer"
        });

        ServiceRequest.hasMany(models.JobAssignment, {
            foreignKey: "serviceRequestId",
            as: "JobAssignments"
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
        serviceId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "created",
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {   sequelize,
        timestamps: true,
    }
    );
}  