export interface ServiceRequestAttributes {
    id: number;
    customerId: number;
    serviceId: number;
    statusId: number;
    locationId: number;
    description: string;
    priority: "Low" | "Medium" | "High";
}
/* export interface ServiceRequestCreationAttributes extends Omit<ServiceRequestAttributes, "id" | "statusId"> {} */

export interface ServiceRequestCreationAttributes {
    customerId: number;
    serviceId: number;
    locationId: number;
    description: string;
}

export interface SmartServiceRequestCreationAttributes {
    customerId: number;
    locationId: number;
    description: string;
}

export enum StatusEnum {
    Created = 1,
    Assigned = 2,
    InProgress = 3,
    Completed = 4,
    Cancelled = 5
}