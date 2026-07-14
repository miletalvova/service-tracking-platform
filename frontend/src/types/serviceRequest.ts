import type { Service } from "./service";
import type { Status } from "./status";
import type { JobAssignment } from "./jobAssignment";
import type { Location } from "./location";
import type { StatusHistory } from "./statusHistory";
import type { User } from "./user";


export interface ServiceRequest {
  id: number;
  customerId: number;
  serviceId: number;
  statusId: number;
  locationId: number;
  description: string;
  priority: "Low" | "Medium" | "High";
  createdAt: Date;

  Service?: Service;
  Status?: Status;
  JobAssignments?: JobAssignment[];
  Location?: Location;
  StatusHistory?: StatusHistory[];
  Customer?: User;
}