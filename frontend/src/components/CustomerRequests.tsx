import './CustomerRequest.css';
import { useState } from 'react';
import type { ServiceRequest } from '../types/serviceRequest';

import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FlagIcon from "@mui/icons-material/Flag";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TimelineIcon from '@mui/icons-material/Timeline';

type Props = {
    requests: ServiceRequest[],
    loading: boolean;
    view: 'active' | 'history';
    setView: React.Dispatch<React.SetStateAction<'active' | 'history'>>;
}

export default function CustomerRequests({ requests, loading, view, setView }: Props) {
    const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);

    if (loading) {
        return <p>Loading...</p>
    }

    const header = (
        <div className='request-header-top'>
            <h2 className='request-title'>
                {view === 'active'
                    ? 'Active Requests'
                    : 'Request History'
                }
            </h2>

            <div className='request-toggle'>
                <button className={view === 'active' ? 'selected' : ''} onClick={() => setView('active')}>Active</button>

                <button className={view === 'history' ? 'selected' : ''} onClick={() => setView('history')}>History</button>
            </div>
        </div>
    );

    if (requests.length === 0) {
        return (
            <div className='customer-card'> {header}
                <p className='empty-state'>
                    {view === "active"
                        ? "You don't have any active requests."
                        : "You don't have any completed requests yet."}
                </p>
            </div>

        )
    }
    return (
        <div className='customer-card'> {header}

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
                            <button className="details-button"
                                onClick={() => setExpandedRequestId(
                                    expandedRequestId === request.id
                                        ? null
                                        : request.id)}
                            >
                                {expandedRequestId === request.id
                                    ? "Hide Details"
                                    : "View Details"}
                            </button>
                        </div>

                        {expandedRequestId === request.id && (
                            <div className='request-details'>

                                <div className='details-grid'>

                                    <section className='details-card'>
                                        <h4><LocationOnIcon fontSize='small' /> Location</h4>
                                        <p>{request.Location?.address}</p>
                                        <p>{request.Location?.city}</p>
                                        <p>{request.Location?.state}</p>
                                    </section>

                                    <section className='details-card'>
                                        <h4><TimelineIcon fontSize='small' />Status Timeline</h4>

                                        {request.StatusHistory?.map(item => (
                                            <div key={item.id} className='timeline-item'>

                                                <div className='timeline-dot'></div>

                                                <div className='timeline-content'>

                                                    <strong>
                                                        {item.OldStatus?.status}
                                                        {" → "}
                                                        {item.NewStatus?.status}
                                                    </strong>

                                                    <span>
                                                        {new Date(item.changedAt).toDateString()}
                                                    </span>
                                                </div>

                                            </div>
                                        ))}
                                    </section>

                                </div>
                            </div>

                        )}

                    </div>
                );
            })
            }
        </div >
    )
}
