import type { ServiceRequest, UpdateServiceRequest } from "../types/serviceRequest";
import type { LocationSearchResult } from "../types/location";
import api from "./axios";

export async function getServiceRequests(status: "all" | "created" | "assigned" | "inprogress" | "completed" | "cancelled"): Promise<ServiceRequest[]> {
    const response = await api.get(`/api/requests?status=${status}`);
    return response.data.data;
}

export async function getServiceRequest(id: string): Promise<ServiceRequest> {
    const response = await api.get(`/api/requests/${id}`);
    return response.data.data;
}

export async function getCustomersRequests(status: 'active' | 'history' | 'all'): Promise<ServiceRequest[]> {
    const response = await api.get(`/api/requests/customer?status=${status}`);
    return response.data.data;
}

export async function createServiceRequest(data: ServiceRequest): Promise<ServiceRequest> {
    const response = await api.post("/api/requests", data);
    return response.data.data;
}

export async function createSmartServiceRequest(description: string, location: LocationSearchResult): Promise<ServiceRequest> {
    const response = await api.post("/api/requests/smart", { description, location });
    return response.data.data;
}

export async function updateServiceRequest(id: number, data: UpdateServiceRequest): Promise<ServiceRequest> {
    const response = await api.put(`/api/requests/${id}`, data);
    return response.data.data;
}

export async function deleteServiceRequest(id: number): Promise<ServiceRequest> {
    const response = await api.delete(`/api/requests/${id}`);
    return response.data.data;
}