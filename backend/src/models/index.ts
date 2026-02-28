import "dotenv/config";
import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import { initUserModel, User } from "./user.js";
import { initRoleModel, Role } from "./role.js";
import { initServiceRequestModel, ServiceRequest } from "./ServiceRequest.js";
import { initServiceModel, Service } from "./service.js";
import { initJobAssignment, JobAssignment } from "./JobAssignment.js";
import { initStatusHistoryModel, StatusHistory } from "./StatusHistory.js";
import { initLocationModel, Location } from "./location.js";
import { initStatusModel, Status } from "./status.js";
import type { Models, SequelizeModel } from "../types/model.types.js";

const { DATABASE_NAME, ADMIN_USERNAME, ADMIN_PASSWORD, HOST, DIALECT } = process.env;

if (!DATABASE_NAME || !ADMIN_USERNAME || !ADMIN_PASSWORD || !HOST) {
    throw new Error("Missing required environment variables: DATABASE_NAME, ADMIN_USERNAME, ADMIN_PASSWORD, HOST");
}

const sequelize = new Sequelize( 
    DATABASE_NAME,
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
    {
        host: HOST,
        dialect: DIALECT as any,
        dialectModule: mysql2,
        logging: false
    }
);

initUserModel(sequelize);
initRoleModel(sequelize);
initServiceRequestModel(sequelize);
initServiceModel(sequelize);
initJobAssignment(sequelize);
initStatusHistoryModel(sequelize);
initLocationModel(sequelize);
initStatusModel(sequelize);

export const models: Omit<Models, "sequelize"> = {
    User,
    Role,
    ServiceRequest,
    Service,
    JobAssignment,
    StatusHistory,
    Location,
    Status
};

Object.values(models).forEach(model => {
    (model as SequelizeModel).associate?.(models as Models)
});

export const db: Models = {
    sequelize,
    ...models
};

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        await sequelize.sync({ force: false });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

export default db;
