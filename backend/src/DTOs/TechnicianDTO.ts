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
    Status?: string;

    constructor(job: any) {
        this.assignmentId = job.id;
        this.Assigned = new Date(job.assignedAt).toString();
        this.Unassigned = job.unassignedAt ? new Date(job.unassignedAt).toString() : null;
        this.Created = new Date(job.createdAt).toString();
        this.Updated = new Date(job.updatedAt).toString();
        this.technicianId = job.Technician.id;
        this.FullName = job.Technician.FirstName + " " + job.Technician.LastName;
        this.Email = job.Technician.Email;
        this.Customer = job.ServiceRequest.Customer.FirstName + " " + job.ServiceRequest.Customer.LastName;
        this.CustomerEmail = job.ServiceRequest.Customer.Email;
        this.Service = job.ServiceRequest.Service.serviceType;
        this.Address = job.ServiceRequest.Location.address + ", " + job.ServiceRequest.Location.city + ", " + job.ServiceRequest.Location.state + " " + job.ServiceRequest.Location.zipCode;
        this.Status = job.ServiceRequest.Status ? job.ServiceRequest.Status.status : undefined;
    }
}