import db from '../models/index.js';
import type { UserCreationAttributes } from '../types/user.types.js';
import type { Models } from '../types/model.types.js';

class UserService {
    constructor(private readonly db: Models) {
    }
    
    async getCustomers() {
        return this.db.User.findAll({
            include: [{
                model: this.db.Role,
                as: 'Role',
                where: { name: 'Customer'}
            }],
            attributes: ['id', 'FirstName', 'LastName']
        });
    }

    async getOne(email: string) {
        return this.db.User.findOne({
            where: { Email: email },
            include: [{ model: this.db.Role, as: 'Role' }],
        });
    }

    async create(data: UserCreationAttributes) {
        const transaction = await this.db.sequelize.transaction();
        try {
            const user = await this.db.User.create(data, { transaction });

            const technicianRole = await this.db.Role.findOne({
                where: { name: 'Technician' },
                transaction,
            });

            if (technicianRole && user.RoleId === technicianRole.id) {
                await this.db.TechnicianProfile.create(
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
