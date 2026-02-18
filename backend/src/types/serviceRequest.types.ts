export interface ServiceRequestAttributes {
    id: number;
    customerId: number;
    serviceId: number;
    statusId: number;
    locationId: number;
}
export interface ServiceRequestCreationAttributes extends Omit<ServiceRequestAttributes, "id"> {}