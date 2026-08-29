import type { Status } from "../types/status";
import api from "./axios";

export async function getStatuses(): Promise<Status[]> {
    const response = await api.get("/api/statuses");
    return response.data.data;
}
