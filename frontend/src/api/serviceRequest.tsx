import type { ServiceRequest } from "../types/serviceRequest";
import api from "./axios";

export async function getServiceRequests(): Promise<ServiceRequest[]> {
    const response = await api.get("/api/requests");
    return response.data.data;
}

export async function getServiceRequest(id: string): Promise<ServiceRequest> {
    const response = await api.get(`/api/requests/${id}`);
    return response.data.data;
}

export async function getActiveRequests(): Promise<ServiceRequest[]> {
    const response = await api.get("/api/requests/customer");
    return response.data.data;
}

export async function createServiceRequest(data: any): Promise<ServiceRequest> {
    const response = await api.post("/api/requests", data);
    return response.data.data;
}

export async function createSmartServiceRequest(customerId: number, description: string, location: any): Promise<ServiceRequest> {
    const response = await api.post("/api/requests/smart", { customerId, description, location });
    return response.data.data;
}

export async function updateServiceRequest(id: string, data: any): Promise<ServiceRequest> {
    const response = await api.put(`/api/requests/${id}`, data);
    return response.data.data;
}

export async function deleteServiceRequest(id: string): Promise<ServiceRequest> {
    const response = await api.delete(`/api/requests/${id}`);
    return response.data.data;
}