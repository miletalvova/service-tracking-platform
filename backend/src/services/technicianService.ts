import db from "../models/index.js";
import type { User } from "../models/user.js";
import type { ServiceRequest } from "../models/ServiceRequest.js";
import type { JobAssignment } from "../models/JobAssignment.js";
import type { Service } from "../models/service.js";
import { TechnicianDTO } from "../DTOs/TechnicianDTO.js";

class TechnicianService {
    client: any;
    User: typeof User;
    ServiceRequest: typeof ServiceRequest;
    JobAssignment: typeof JobAssignment;
    Service: typeof Service;
    constructor(db: any) {
        this.client = db.sequelize;
        this.User = db.User;
        this.ServiceRequest = db.ServiceRequest;
        this.JobAssignment = db.JobAssignment;
        this.Service = db.Service;
    }

    async getAssignedRequests(technicianId: number) {
        const assignments = await this.JobAssignment.findAll({
            where: { technicianId },
            include: [
                {
                    model: this.ServiceRequest,
                    as: "ServiceRequest",
                    include: [
                        {
                            model: this.Service,
                            as: "Service"
                        }
                    ]

                },
                {
                    model: this.User,
                    as: "Technician",
                    attributes: ["id", "FirstName", "LastName", "Email"]
                }
            ]
        });
        return assignments.map(job => new TechnicianDTO(job));
    }
}

export default new TechnicianService(db);
