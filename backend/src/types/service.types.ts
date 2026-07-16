export interface ServiceAttributes {
    id: number;
    specialization: string;
    description: string;
}

export interface ServiceCreationAttributes extends Omit<ServiceAttributes, 'id'> {}
