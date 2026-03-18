import db from "../models/index.js";
import type { User } from "../models/user.js";
import type { ServiceRequest } from "../models/ServiceRequest.js";
import type { JobAssignment } from "../models/JobAssignment.js";

class TechnicianService {
    client: any;
    User: typeof User;
    ServiceRequest: typeof ServiceRequest;
    JobAssignment: typeof JobAssignment;
    constructor(db: any) {
        this.client = db.sequelize;
        this.User = db.User;
        this.ServiceRequest = db.ServiceRequest;
        this.JobAssignment = db.JobAssignment;
    }
    async getAssignedRequests(technicianId: number) {
        return this.JobAssignment.findAll({
            where: { technicianId },
            include: [
                {
                    model: this.ServiceRequest,
                    as: "ServiceRequest"
                }
            ]
        });
    }
}

export default new TechnicianService(db);
