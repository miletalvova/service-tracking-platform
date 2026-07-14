import type { JobAssignment } from "../types/jobAssignment";
import api from "./axios";

export async function getJobAssignments(): Promise<JobAssignment[]> {
    const response = await api.get("/api/assignments");
    return response.data.data;
}

export async function getRecommendedTechnician(serviceRequestId: number): Promise<JobAssignment> {
    const response = await api.get(`/api/assignments/recommend/${serviceRequestId}`);
    return response.data.data;
}

export async function getJobAssignment(id: string): Promise<JobAssignment> {
    const response = await api.get(`/api/assignments/${id}`);
    return response.data.data;
}

export async function createJobAssignment(data: any): Promise<JobAssignment> {
    const response = await api.post("/api/assignments", data);
    return response.data.data;
}

export async function updateJobAssignment(id: string, data: any): Promise<JobAssignment> {
    const response = await api.put(`/api/assignments/${id}`, data);
    return response.data.data;
}

export async function deleteJobAssignment(id: string): Promise<JobAssignment> {
    const response = await api.delete(`/api/assignments/${id}`);
    return response.data.data;
}