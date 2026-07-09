import './CustomerRequest.css';
import type { ServiceRequest } from '../types/serviceRequest';

import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FlagIcon from "@mui/icons-material/Flag";

type Props = {
    requests: ServiceRequest[], 
    loading: boolean;
}

export default function CustomerRequests({ requests, loading }: Props ) {

    if (loading) {
        return <p>Loading...</p>
    }

    if (requests.length === 0) {
        return (
            <div className="customer-card">
                <h2>Active Requests</h2>
                <p>You don't have any active requests</p>
            </div>
        )

    }
    return (
        <div className="customer-card">
            <h2 className="request-title">Active Requests</h2>

            {requests.map(request => {
                const assignment = request.JobAssignments?.[0];
                const technician = assignment?.Technician;
                const statusClass = request.Status?.status.toLocaleLowerCase();
                const priorityClass = request.priority.toLocaleLowerCase()

                return (
                    <div className="request-card" key={request.id}>

                        <div className="request-header">

                            <div>
                                <h3>{request.Service?.specialization}</h3>
                                <small>Request #{request.id}</small>
                            </div>

                            <span className={`status ${statusClass}`}>{request.Status?.status}</span>
                        </div>

                        <div className="request-description">
                            {request.description}
                        </div>

                        <div className="request-info">

                            <div className={`info-item priority ${priorityClass}`}>
                                <FlagIcon fontSize="small" />
                                <div>
                                    <small>Priority</small>
                                    <strong> {request.priority}</strong>
                                </div>
                            </div>

                            <div className="info-item">
                                <PersonIcon fontSize="small" />
                                <div>
                                    <small>Technician</small>
                                    <strong> {technician
                                        ? `${technician.FirstName} ${technician.LastName}`
                                        : "Unassigned"}
                                    </strong>
                                </div>
                            </div>

                            <div className="info-item">
                                <ScheduleIcon fontSize="small" />
                                <div>
                                    <small>Updated</small>
                                    <strong> {assignment
                                        ? new Date(assignment.updatedAt).toLocaleString()
                                        : "-"}
                                    </strong>
                                </div>
                            </div>

                        </div>

                        <div className="request-footer">
                            <button className="details-button">View Details</button>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}
