import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";    
import type { User } from "./user.js";
import type { ServiceRequest } from "./ServiceRequest.js";

export class JobAssignment extends Model<InferAttributes<JobAssignment>, InferCreationAttributes<JobAssignment, { omit: "id" }>> {
    declare id: number;
    declare serviceRequestId: number;
    declare technicianId: number;
    declare assignedAt: Date;
    declare unassignedAt?: Date;

    declare Technician?: User;
    declare ServiceRequest?: ServiceRequest;

    static associate(models: any) {
        JobAssignment.belongsTo(models.User, {
            foreignKey: "technicianId",
            as: "Technician"
        });
        JobAssignment.belongsTo(models.ServiceRequest, {
            foreignKey: "serviceRequestId",
            as: "ServiceRequest"
        });
    }
}

export function initJobAssignment(sequelize: Sequelize) {
    JobAssignment.init(
        {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        serviceRequestId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        technicianId: {
            type: DataTypes.INTEGER,
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