import { Sequelize, Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes } from "sequelize";
import type { Models } from "../types/model.types.js";
import type { Role } from "./role.js";

export class User
extends Model<InferAttributes<User>, InferCreationAttributes<User, { omit: "id" }>> {
    declare id: number;
    declare FirstName: string;
    declare LastName: string;
    declare Email: string;
    declare Username: string;
    declare EncryptedPassword: string;
    declare RoleId: number;
    declare Role?: Role;

    static associate(models: Models) {
        User.belongsTo(models.Role, {
            foreignKey: "RoleId",
            as: "Role"
        });

        User.hasMany(models.ServiceRequest, {
            foreignKey: "customerId",
            as: "CustomerServiceRequests"
        });

        User.hasMany(models.JobAssignment, {
            foreignKey: "technicianId",
            as: "TechnicianAssignments"
        });
    }
}
export function initUserModel(sequelize: Sequelize) {
    User.init (
        {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },  
        EncryptedPassword: {
            type: DataTypes.STRING,
            allowNull: false
        },
        RoleId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        }
    }, 
    {
        sequelize,
        timestamps: false
        }
    );
};


/* interface UserInstance extends Model<UserAttributes>, UserAttributes {} */

/* export default (sequelize: Sequelize) => {
    const User = sequelize.define("User", {
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },  
        EncryptedPassword: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        Salt: {
            type: DataTypes.BLOB,
            allowNull: false
        }
    }, {
            timestamps: false
        });
    return User;
}; */