import db from "../models/index.js";
import { JobAssignment } from "../models/JobAssignment.js";
import type { User } from "../models/user.js";
import type { JobAssignmentCreationAttributes } from "../types/jobAssignment.types.js";

class JobAssignmentService {
    client: any;
    JobAssignment: typeof JobAssignment;
    User: typeof User;
    constructor(db: any) {
        this.client = db.sequelize;
        this.JobAssignment = db.JobAssignment;
        this.User = db.User;
    }
    async create(data: JobAssignmentCreationAttributes) {
        return this.JobAssignment.create(data);
    }

    async getAll() {
        return this.JobAssignment.findAll();
    }

    async getOneById(id: number) {
        return this.JobAssignment.findByPk(id);
    }

    async update(id: number, data: JobAssignmentCreationAttributes) {
        const jobAssignment = await this.JobAssignment.findByPk(id);
        if(!jobAssignment) {
            throw new Error("Job Assignmengt not found");
        }
        return jobAssignment.update(data);
    }

    async delete(id: number) {
        const jobAssignment = await this.JobAssignment.findByPk(id);
        if(!jobAssignment) {
            throw new Error("Job Assignmengt not found")
        }
        return jobAssignment.destroy();
    }
}

export default new JobAssignmentService(db);
