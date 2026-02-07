import "dotenv/config";
import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import { initUserModel, User } from "./user.js";
import { initRoleModel, Role } from "./role.js";
import { initServiceRequestModel } from "./ServiceRequest.js";
import { initServiceModel } from "./Service.js";
import { initJobAssignment } from "./JobAssignment.js";
import { initStatusHistoryModel } from "./StatusHistory.js";
import { initLocationModel } from "./location.js";

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

Role.associate({ User });
User.associate({ Role });


export const db = {
    sequelize,
    User,
    Role,
};

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        db.sequelize.sync({ force: false });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

console.log("DATABASE CHECK:" + db);

export default db;
