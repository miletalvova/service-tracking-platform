import './AllRequests.css';
import { useState, useEffect } from 'react';
import { getServiceRequests } from '../api/serviceRequest';
import type { ServiceRequest } from '../types/serviceRequest';

type Props = {
    onSelectRequest: (request: ServiceRequest) => void;
    onAssignRequest: (request: ServiceRequest) => void;
    refreshKey: number
}

export default function AllRequests({ onSelectRequest, onAssignRequest, refreshKey }: Props) {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [statusFilter, setStatusFilter] = useState<
        "all" |
        "created" |
        "assigned" |
        "inprogress" |
        "completed" |
        "cancelled"
    >("all");

    useEffect(() => {
        async function fetchRequests() {
            try {
                const data = await getServiceRequests(statusFilter)
                setRequests(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchRequests();
    }, [statusFilter, refreshKey]);

    return (
        <section className='request-card'>

            <header className='requests-card-header'>

                <div>
                    <h2>All Requests</h2>
                    <p>
                        {requests.length}{' '}
                        {requests.length === 1
                            ? 'request'
                            : 'requests'
                        }
                    </p>
                </div>

                <div className='requests-filter'>

                    <label htmlFor='status-filter'>Status</label>

                    <select id='status-filter' value={statusFilter} onChange={e => setStatusFilter(e.target.value as "all" | "created" | "assigned" | "inprogress" | "completed" | "cancelled")}>
                        <option value="all">All</option>
                        <option value="created">Created</option>
                        <option value="assigned">Assigned</option>
                        <option value="inprogress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                </div>

            </header>

            <div className='requests-table-wrapper'>

                <table className='requests-table'>

                    <thead>
                        <tr>
                            <th className='column-id'>#</th>
                            <th>Service</th>
                            <th>Customer</th>
                            <th>Technician</th>
                            <th>Created</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th className='column-action'>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={8}
                                    className='requests-empty'
                                >
                                    No service requests found.
                                </td>
                            </tr>
                        ) : (
                            requests.map((request) => {
                                const technician = request.JobAssignments?.[0]?.Technician;

                                const status = request.Status?.status;

                                return (
                                    <tr key={request.id} onClick={() => onSelectRequest(request)}>

                                        <td className='request-id'>#{request.id}</td>
                                        <td className='service-cell'>{request.Service?.specialization}</td>
                                        <td>{request.Customer
                                            ? `${request.Customer?.FirstName} ${request.Customer?.LastName}`
                                            : '—'}</td>
                                        <td>
                                            {technician ? (
                                                <span className='technican-name'>
                                                    {technician.FirstName}{' '}
                                                    {technician.LastName}
                                                </span>
                                            ) : (
                                                <span className='awaiting-assignment'>
                                                    Awaiting assignment
                                                </span>
                                            )}
                                        </td>
                                        <td className='date-cell'>{new Date(request.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`request-priority ${request.priority.toLowerCase()}`}>
                                                <span className='priority-dot' />
                                                {request.priority}
                                            </span>
                                        </td>
                                        <td>
                                            {status && (
                                                <span className={`status ${status.replace(/\s+/g, "").toLowerCase()}`}>{status}</span>
                                            )}
                                        </td>
                                        <td className='action-cell'>
                                            {status === 'Created' ? (
                                                <button
                                                    type='button'
                                                    className='assign-button'
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        onAssignRequest(request)
                                                    }}
                                                >
                                                    Assign
                                                </button>
                                            ) : (
                                                <span className='no-action'>
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })

                        )}

                    </tbody>

                </table>

            </div>

        </section>
    )
}
