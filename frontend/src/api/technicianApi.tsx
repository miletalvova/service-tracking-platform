import type { Technician, WorkloadOverview } from "../types/technician";
import api from "./axios";

export async function getTechnicianRequests(): Promise<Technician[]> {
    const response = await api.get("api/technicians/assigned-requests");
    return response.data.data;
}

export async function getWorkload(): Promise<WorkloadOverview> {
    const response = await api.get("api/technicians/workload");
    return response.data.data;
}

export async function updateJobStatus(id: string, statusId: number): Promise<Technician[]> {
    const response = await api.patch(`/api/technicians/${id}/status`, { statusId });
    return response.data.data;
}

export async function updateProfile(data: {
    skills?: string;
    isAvailable: boolean;
    currentLocationId: number;
    maxActiveJobs: number;
}): Promise<Technician> {

    const response = await api.patch("/api/technicians/profile", data);
    return response.data.data;
}