export interface ServiceRequestAttributes {
    id: number;
    customerId: number;
    serviceId: number;
    statusId: number;
    locationId: number;
}
export interface ServiceRequestCreationAttributes extends Omit<ServiceRequestAttributes, "id" | "statusId"> {}

export enum StatusEnum {
    Created = 1,
    Assigned = 2,
    InProgress = 3,
    Completed = 4,
    Cancelled = 5
}