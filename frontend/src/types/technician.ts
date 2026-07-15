export interface Technician {
  id: number;
  userId: number;
  skills: string;
  isAvailable: boolean;
  currentLocationId: number | null;
  maxActiveJobs: number;
}

export interface WorkloadOverview {
  totalTechnicians: number;
  available: number;
  busy: number;
  atCapacity: number;
}