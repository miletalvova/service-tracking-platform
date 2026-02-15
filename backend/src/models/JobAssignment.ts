import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { ServiceRequest } from "./ServiceRequest.js";
import type { Models } from "../types/model.types.js";

export class JobAssignment extends Model<InferAttributes<JobAssignment>, InferCreationAttributes<JobAssignment, { omit: "id" }>> {
    declare id: number;
    declare serviceRequestId: number;
    declare technicianId: number;
    declare assignedAt: Date;
    declare unassignedAt?: Date;

    declare ServiceRequest?: ServiceRequest;

    static associate(models: Models) {
        JobAssignment.belongsTo(models.ServiceRequest, {
            foreignKey: "serviceRequestId",
            as: "ServiceRequest"
        });

        JobAssignment.belongsTo(models.User, {
            foreignKey: "technicianId",
            as: "Technician"
        });
    }
}

export function initJobAssignment(sequelize: Sequelize) {
    JobAssignment.init(
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
        technicianId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        assignedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        unassignedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        timestamps: true
    });
}