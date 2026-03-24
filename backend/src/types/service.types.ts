export interface ServiceAttributes {
    id: number;
    serviceType: string;
    description: string;
}

export interface ServiceCreationAttributes extends Omit<ServiceAttributes, "id"> {}