import './Workload.css';
import { useState, useEffect } from 'react';
import { getServiceRequests } from '../api/serviceRequest';
import { getWorkload } from '../api/technicianApi';
import type { ServiceRequest } from '../types/serviceRequest';
import type { WorkloadOverview } from '../types/technician';

type Stats = {
    created: number,
    assigned: number,
    inprogress: number,
    completed: number,
    cancelled: number,
}

type Props = {
    refreshKey: number;
}

export default function WorkloadOverview({refreshKey}: Props) {
    const [stats, setStats] = useState<Stats>({
        created: 0,
        assigned: 0,
        inprogress: 0,
        completed: 0,
        cancelled: 0
    })
    const [tech, setTech] = useState<WorkloadOverview>({
        totalTechnicians: 0,
        available: 0,
        busy: 0,
        atCapacity: 0
    });

    useEffect(() => {
        async function fetchRequests() {
            try {
                const [requests, technicianOverview] = await Promise.all([
                    getServiceRequests("all"),
                    getWorkload()
                ]);

                setStats({
                    created: requests.filter((r: ServiceRequest) => r.Status?.status === 'Created').length,
                    assigned: requests.filter((r: ServiceRequest) => r.Status?.status === 'Assigned').length,
                    inprogress: requests.filter((r: ServiceRequest) => r.Status?.status === 'In Progress').length,
                    completed: requests.filter((r: ServiceRequest) => r.Status?.status === 'Completed').length,
                    cancelled: requests.filter((r: ServiceRequest) => r.Status?.status === 'Cancelled').length,
                })

                setTech(technicianOverview);

            } catch (error) {
                console.error(error);
            }
        }
        fetchRequests()
    }, [refreshKey]);

    return (
        <section className='workload-overview'>


            <div className='workload-header'>
                <div>
                    <h2>Workload Overview</h2>
                    <p>Current operational status.</p>
                </div>
            </div>

            <section className='dashboard-section'>

                <h3>Service Requests</h3>

                <div className='workload-list'>

                    <div className='workload-row'>
                        <div className="workload-label">
                            <span className="workload-dot created-dot"></span>
                            <span>New</span>
                        </div>

                        <strong>{stats.created}</strong>
                    </div>

                    <div className='workload-row'>
                        <div className="workload-label">
                            <span className="workload-dot assigned-dot"></span>
                            <span>Assigned</span>
                        </div>

                        <strong>{stats.assigned}</strong>
                    </div>

                    <div className='workload-row'>
                        <div className="workload-label">
                            <span className="workload-dot inprogress-dot"></span>
                            <span>In Progress</span>
                        </div>

                        <strong>{stats.inprogress}</strong>
                    </div>

                    <div className='workload-row'>
                        <div className="workload-label">
                            <span className="workload-dot completed-dot"></span>
                            <span>Completed</span>
                        </div>

                        <strong>{stats.completed}</strong>
                    </div>

                    <div className='workload-row'>
                        <div className="workload-label">
                            <span className="workload-dot cancelled-dot"></span>
                            <span>Cancelled</span>
                        </div>
                        <strong>{stats.cancelled}</strong>
                    </div>

                </div>

            </section>

            <section className='dashboard-section'>

                <h3>Technicians</h3>

                <div className='workload-list'>

                    <div className='workload-row'>
                        <div className="workload-label">
                            <span className="workload-dot total-dot"></span>
                            <span>Total</span>
                        </div>

                        <strong>{tech.totalTechnicians}</strong>
                    </div>

                    <div className='workload-row'>
                        <div className="workload-label">
                            <span className="workload-dot available-dot"></span>
                            <span>Available</span>
                        </div>

                        <strong>{tech.available}</strong>
                    </div>

                    <div className='workload-row'>
                        <div className="workload-label">
                            <span className="workload-dot busy-dot"></span>
                            <span>Busy</span>
                        </div>

                        <strong>{tech.busy}</strong>
                    </div>

                    <div className='workload-row'>
                        <div className="workload-label">
                            <span className="workload-dot capacity-dot"></span>
                            <span>At Capacity</span>
                        </div>
                        
                        <strong>{tech.atCapacity}</strong>
                    </div>

                </div>

            </section>

        </section >
    )
}