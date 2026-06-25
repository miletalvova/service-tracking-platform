export interface JobAssignment {
  id: number;
  serviceRequestId: number;
  technicianId: number;
  assignedAt: Date;
  unassignedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  Technician?: {
    id: number;
    FirstName: string;
    LastName: string;
  }
}