import api from "./axios";

export async function searchAddress(query: string) {
    const response = await api.get(`/api/locations/search?q=${encodeURIComponent(query)}`);
    return response.data;
}