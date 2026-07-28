import type { JobAssignment } from '../models/JobAssignment.js';
import type { ServiceRequest } from '../models/ServiceRequest.js';
import type { User } from '../models/user.js';
import type { Service } from '../models/service.js';
import type { Location } from '../models/location.js';
import type { Status } from '../models/status.js';

export type TechnicianAssignment = JobAssignment & {
    Technician: User;
    createdAt: string | Date;
    updatedAt: string | Date;

    ServiceRequest: ServiceRequest & {
        Service: Service;
        Customer: User;
        Location: Location;
        Status: Status;
    };
};

export class TechnicianDTO {
    assignmentId: number;
    Assigned: string;
    Unassigned: string | null;
    Created: string;
    Updated: string;
    technicianId: number;
    FullName: string;
    Email: string;
    Customer: string;
    CustomerEmail: string;
    Service: string;
    Address: string;
    Status?: string | undefined;

    constructor(job: TechnicianAssignment) {
        this.assignmentId = job.id;
        this.Assigned = new Date(job.assignedAt).toISOString();
        this.Unassigned = job.unassignedAt ? new Date(job.unassignedAt).toISOString() : null;
        this.Created = new Date(job.createdAt).toISOString();
        this.Updated = new Date(job.updatedAt).toISOString();
        this.technicianId = job.Technician.id;
        this.FullName = job.Technician.FirstName + ' ' + job.Technician.LastName;
        this.Email = job.Technician.Email;
        this.Customer =
            job.ServiceRequest.Customer.FirstName + ' ' + job.ServiceRequest.Customer.LastName;
        this.CustomerEmail = job.ServiceRequest.Customer.Email;
        this.Service = job.ServiceRequest.Service.specialization;
        this.Address =
            job.ServiceRequest.Location.address +
            ', ' +
            job.ServiceRequest.Location.city +
            ', ' +
            job.ServiceRequest.Location.state +
            ' ' +
            job.ServiceRequest.Location.zipCode;
        this.Status = job.ServiceRequest.Status ? job.ServiceRequest.Status.status : undefined;
    }
}
