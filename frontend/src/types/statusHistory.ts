import type { Status } from "./status";

export interface StatusHistory {
    id: number;
    serviceRequestId: number;
    oldStatusId: number;
    newStatusId: number;
    changedAt: string;

    OldStatus?: Status;
    NewStatus?: Status;
}