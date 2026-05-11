import db from "../models/index.js";
import type { User } from "../models/user.js";
import type { ServiceRequest } from "../models/ServiceRequest.js";
import type { JobAssignment } from "../models/JobAssignment.js";
import type { Service } from "../models/service.js";
import type { Location } from "../models/location.js";
import type { Status } from "../models/status.js";
import { TechnicianDTO } from "../DTOs/TechnicianDTO.js";
import statusService from "./statusService.js";
import type { TechnicianProfile } from "../models/TechnicianProfile.js";

class TechnicianService {
    client: any;
    User: typeof User;
    TechnicianProfile: typeof TechnicianProfile;
    ServiceRequest: typeof ServiceRequest;
    JobAssignment: typeof JobAssignment;
    Service: typeof Service;
    Location: typeof Location;
    Status: typeof Status;
    constructor(db: any) {
        this.client = db.sequelize;
        this.User = db.User;
        this.TechnicianProfile = db.TechnicianProfile;
        this.ServiceRequest = db.ServiceRequest;
        this.JobAssignment = db.JobAssignment;
        this.Service = db.Service;
        this.Location = db.Location;
        this.Status = db.Status;
    }

    async getOneByUserId(userId: number) {
        return this.TechnicianProfile.findOne({ where: { userId } });
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
                        },
                        {
                            model: this.User,
                            as: "Customer",
                            attributes: ["id", "FirstName", "LastName", "Email"]
                        },
                        {
                            model: this.Location,
                            as: "Location",
                            attributes: ["address", "city", "state", "zipCode"]
                        },
                        {
                            model: this.Status,
                            as: "Status",
                            attributes: ["status"]
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

    async updateStatus(serviceRequestId: number, statusId: number, technicianId: number) {
        const transaction = await this.client.transaction();
        try {
            const assignment = await this.JobAssignment.findOne({
                where: {
                    serviceRequestId, technicianId, unassignedAt: null
                },
                transaction
            });

            if (!assignment) {
                throw new Error("No active assignment found for this service request and technician");
            }
            
            await statusService.updateStatus(serviceRequestId, statusId, transaction);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

}

export default new TechnicianService(db);
