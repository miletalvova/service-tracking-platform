import type { Service } from "./service";
import type { Status } from "./status";
import type { JobAssignment } from "./jobAssignment";

export interface ServiceRequest {
  id: number;
  customerId: number;
  serviceId: number;
  statusId: number;
  locationId: number;
  description: string;
  priority: "Low" | "Medium" | "High";

  Service?: Service;
  Status?: Status;
  JobAssignments?: JobAssignment[];
}