import db from "../models/index.js";
import type { User } from "../models/user.js";
import type { Role } from "../models/role.js";
import type { UserCreationAttributes } from "../types/user.types.js";

class UserService {
    client: any;
    User: typeof User;
    Role: typeof Role;
    constructor(db: any) {
        this.client = db.sequelize;
        this.User = db.User;
        this.Role = db.Role;
    }

    async getOne(email: string) {
        return this.User.findOne({
            where: { Email: email },
            include: [{ model: db.Role, as: "Role" }]
        });
    }

    async create(data: UserCreationAttributes) {
        return this.User.create(data);
    }

}

export default new UserService(db);