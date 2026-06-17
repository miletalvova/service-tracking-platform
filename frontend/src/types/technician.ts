export interface Technician {
  id: number;
  userId: number;
  skills: string;
  isAvailable: boolean;
  currentLocationId: number | null;
  maxActiveJobs: number;
}