export interface ServiceRequest {
  id: number;
  customerId: number;
  serviceId: number;
  statusId: number;
  locationId: number;
  description: string;
  priority: "Low" | "Medium" | "High";
}