import { Sequelize, DataTypes } from "sequelize";

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