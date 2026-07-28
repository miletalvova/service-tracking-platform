export interface ServiceAttributes {
    id: number;
    specialization: string;
    description: string;
}

export type ServiceCreationAttributes = Omit<ServiceAttributes, 'id'>;
