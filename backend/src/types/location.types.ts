export interface LocationAttributes {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

export type LocationCreationAttributes = Omit<LocationAttributes, 'id'>;
