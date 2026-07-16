import db from '../models/index.js';
import type { User } from '../models/user.js';
import type { Role } from '../models/role.js';
import type { TechnicianProfile } from '../models/TechnicianProfile.js';
import type { UserCreationAttributes } from '../types/user.types.js';

class UserService {
    client: any;
    User: typeof User;
    Role: typeof Role;
    TechnicianProfile: typeof TechnicianProfile;
    constructor(db: any) {
        this.client = db.sequelize;
        this.User = db.User;
        this.Role = db.Role;
        this.TechnicianProfile = db.TechnicianProfile;
    }

    async getOne(email: string) {
        return this.User.findOne({
            where: { Email: email },
            include: [{ model: this.Role, as: 'Role' }],
        });
    }

    async create(data: UserCreationAttributes) {
        const transaction = await this.client.transaction();
        try {
            const user = await this.User.create(data, { transaction });

            const technicianRole = await this.Role.findOne({
                where: { name: 'Technician' },
                transaction,
            });

            if (technicianRole && user.RoleId === technicianRole.id) {
                await this.TechnicianProfile.create(
                    {
                        userId: user.id,
                        skills: '',
                        isAvailable: true,
                        currentLocationId: null,
                        maxActiveJobs: 3,
                    },
                    { transaction }
                );
            }
            await transaction.commit();
            return user;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}

export default new UserService(db);
