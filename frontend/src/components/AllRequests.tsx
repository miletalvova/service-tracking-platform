import './AllRequests.css';
import { useState, useEffect } from 'react';
import { getServiceRequests } from '../api/serviceRequest';
import type { ServiceRequest } from '../types/serviceRequest';

type Props = {
    onSelectRequest: (id: number) => void
}

export default function AllRequests({ onSelectRequest }: Props) {
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
    }, [statusFilter]);

    return (
        <div className='staff-card'>
            <div className='card-header'>
                <h2>All Requests</h2>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as "all" | "created" | "assigned" | "inprogress" | "completed" | "cancelled")}>
                    <option value="all">All</option>
                    <option value="created">Created</option>
                    <option value="assigned">Assigned</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

            </div>

            <table className='requests-table'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Service</th>
                        <th>Customer</th>
                        <th>Technician</th>
                        <th>Created</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((r) => {
                        const technician = r.JobAssignments?.[0]?.Technician;

                        return (
                        <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>{r.Service?.specialization}</td>
                            <td>{r.Customer?.FirstName} {r.Customer?.LastName}</td>
                            <td>{technician
                                ? `${technician.FirstName} ${technician.LastName}`
                                : "Awaiting Assignment"}</td>
                            <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                            <td><span className={`priority ${r.priority.toLowerCase()}`}>{r.priority}</span></td>
                            <td><span className={`status ${r.Status?.status.toLowerCase()}`}>{r.Status?.status}</span></td>
                            <td>
                                {r.Status?.status === 'Created' && (
                                    <button onClick={() => onSelectRequest(r.id)}>Assign</button>
                                )}
                            </td>
                        </tr>
                        );
                    })}
                </tbody>

            </table>

        </div>
    )
}
