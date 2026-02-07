import "dotenv/config";
import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import { initUserModel, User } from "./user.js";
import { initRoleModel, Role } from "./role.js";
import { initServiceRequestModel, ServiceRequest } from "./ServiceRequest.js";
import { initServiceModel, Service } from "./Service.js";
import { initJobAssignment, JobAssignment } from "./JobAssignment.js";
import { initStatusHistoryModel, StatusHistory } from "./StatusHistory.js";
import { initLocationModel, Location } from "./location.js";
import type { Models, SequelizeModel } from "../types/model.types.js";

const sequelize = new Sequelize( 
    process.env.DATABASE_NAME!,
    process.env.ADMIN_USERNAME!,
    process.env.ADMIN_PASSWORD!,
    {
        host: process.env.HOST || "localhost",
        dialect: "mysql",
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

export const models: Omit<Models, "sequelize"> = {
    User,
    Role,
    ServiceRequest,
    Service,
    JobAssignment,
    StatusHistory,
    Location
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
