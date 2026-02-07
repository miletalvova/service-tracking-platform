import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";

export class JobAssignment extends Model<InferAttributes<JobAssignment>, InferCreationAttributes<JobAssignment, { omit: "id" }>> {
    declare id: number;
    declare serviceRequestId: number;
    declare assignedTo: number;
    declare status: "assigned" | "in_progress" | "completed";
}

export function initJobAssignment(sequelize: Sequelize) {
    const JobAssignment = sequelize.define("JobAssignment", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        serviceRequestId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        assignedTo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "assigned"
        }
    }, {
        timestamps: true
    });

    return JobAssignment;
}