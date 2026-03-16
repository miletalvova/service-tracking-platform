export interface ServiceAttributes {
    id: number;
    serviceType: "Plumbing" | "Electrical" | "IT";
    description: string;
}

export interface ServiceCreationAttributes extends Omit<ServiceAttributes, "id"> {}