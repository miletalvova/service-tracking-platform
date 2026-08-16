import type { Location } from '../models/location.js';

export interface TechnicianRecommendation {
    id: number;
    name: string;
    skills: string;
    isAvailable: boolean;
    activeJobs: number;
    maxActiveJobs: number;
    currentLocation: Location | null;
}