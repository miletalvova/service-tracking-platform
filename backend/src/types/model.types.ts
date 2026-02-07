import { User } from "../models/user.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { Role } from "../models/role.js";

export interface Models {
    User: typeof User;
    ServiceRequest: typeof ServiceRequest;
    Role: typeof Role;
}
