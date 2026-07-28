export interface JobAssignmentAttributes {
    id: number;
    serviceRequestId: number;
    technicianId: number;
    assignedAt: Date;
    unassignedAt?: Date;
}

export type JobAssignmentCreationAttributes = Omit<
    JobAssignmentAttributes,
    'id' | 'assignedAt' | 'unassignedAt'
>;
