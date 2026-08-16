export interface Location {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface LocationSearchResult {
    place_id: number;
    display_name: string;
    address: {
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        postcode?: string;
    };
}