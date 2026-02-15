import { Sequelize } from "sequelize";
import { User } from "../models/user.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { Role } from "../models/role.js";
import { Service } from "../models/service.js";
import { JobAssignment } from "../models/JobAssignment.js";
import { StatusHistory } from "../models/StatusHistory.js";
import { Location } from "../models/location.js";
import { Status } from "../models/status.js"
import type { ModelStatic, Model } from "sequelize";

export interface Models {
    sequelize: Sequelize;
    User: typeof User;
    ServiceRequest: typeof ServiceRequest;
    Role: typeof Role;
    Service: typeof Service;
    JobAssignment: typeof JobAssignment;
    StatusHistory: typeof StatusHistory;
    Location: typeof Location;
    Status: typeof Status;
}

export type SequelizeModel = ModelStatic<Model> & { associate?: (models: Omit <Models, "sequelize">) => void };