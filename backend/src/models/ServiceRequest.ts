import { Sequelize, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { User } from "./user.js";
import type { Models } from "../types/model.types.js";
import type { JobAssignment } from "./JobAssignment.js";
import { StatusHistory } from "./StatusHistory.js";
import { Service } from "./service.js";
import { Location } from "./location.js";
import { Status } from "./status.js"

export class ServiceRequest extends Model<InferAttributes<ServiceRequest>, InferCreationAttributes<ServiceRequest, { omit: "id" }>> {
    declare id: number;
    declare customerId: number;
    declare serviceId: number;
    declare statusId: number;
    declare locationId: number;

    declare Customer?: User;
    declare JobAssignments?: JobAssignment[];
    declare StatusHistory?: StatusHistory[];
    declare Service?: Service;
    declare Location?: Location;
    declare Status?: Status

    static associate(models: Models) {
        ServiceRequest.belongsTo(models.User, {
            foreignKey: "customerId",
            as: "Customer"
        });

        ServiceRequest.hasMany(models.JobAssignment, {
            foreignKey: "serviceRequestId",
            as: "JobAssignments"
        });

        ServiceRequest.hasMany(models.StatusHistory, {
            foreignKey: "serviceRequestId",
            as: "StatusHistory"
        });

        ServiceRequest.belongsTo(models.Service, {
            foreignKey: "serviceId",
            as: "Service"
        });

        ServiceRequest.belongsTo(models.Location, {
            foreignKey: "locationId",
            as: "Location"
        });

        ServiceRequest.belongsTo(models.Status, {
            foreignKey: "statusId",
            as: "Status"
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
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        statusId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        locationId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        }
    },
    {   sequelize,
        timestamps: true,
    }
    );
};