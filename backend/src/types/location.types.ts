export interface LocationAttributes {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface LocationCreationAttributes extends Omit<LocationAttributes, "id"> {}