import api from "./axios";
import type { LocationSearchResult } from '../types/location';

export async function searchAddress(query: string): Promise<LocationSearchResult[]> {
    const response = await api.get<LocationSearchResult[]>(`/api/locations/search?q=${encodeURIComponent(query)}`);
    return response.data;
}