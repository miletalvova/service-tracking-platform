export interface JobAssignmentAttributes {
    id: number;
    serviceRequestId: number;
    technicianId: number;
    assignedAt: Date;
    unassignedAt?: Date;
}

export interface JobAssignmentCreationAttributes extends Omit<JobAssignmentAttributes, "id" | "assignedAt" | "unassignedAt"> {}