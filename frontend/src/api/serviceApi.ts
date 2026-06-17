import type { Service } from "../types/service";
import api from "./axios";

export async function getServices(): Promise<Service[]> {
    const response = await api.get("/api/services");
    return response.data.data;
}

export async function getService(id: string): Promise<Service> {
    const response = await api.get(`/api/services/${id}`);
    return response.data.data;
}

export async function createService(data: any): Promise<Service> {
    const response = await api.post("/api/services", data);
    return response.data.data;
}

export async function updateService(id: string, data: any): Promise<Service> {
    const response = await api.put(`/api/services/${id}`, data);
    return response.data.data;
}

export async function deleteService(id: string): Promise<Service> {
    const response = await api.delete(`/api/services/${id}`);
    return response.data.data;
}