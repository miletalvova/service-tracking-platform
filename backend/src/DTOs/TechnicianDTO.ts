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

    constructor(job: any) {
        this.assignmentId = job.id;
        this.Assigned = new Date(job.assignedAt).toString();
        this.Unassigned = job.unassignedAt ? new Date(job.unassignedAt).toString() : null;
        this.Created = new Date(job.createdAt).toString();
        this.Updated = new Date(job.updatedAt).toString();
        this.technicianId = job.Technician.id;
        this.FullName = job.Technician.FirstName + " " + job.Technician.LastName;
        this.Email = job.Technician.Email;
        this.Customer = job.Customer.FirstName + " " + job.Customer
        .LastName;
    }
}