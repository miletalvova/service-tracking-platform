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

export default function WorkloadOverview() {
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
    }, []);

    return (
        <section className='workload-overview'>
            <h2>Workload Overview</h2>
            <section className='dashoard-section'>
                <h3>Service Requests</h3>
                <div className='stats-row'>
                    <div className='stat-card created'>
                        <h3>{stats.created}</h3>
                        <p>New</p>
                    </div>
                    <div className='stat-card assigned'>
                        <h3>{stats.assigned}</h3>
                        <p>Assigned</p>
                    </div>
                    <div className='stat-card inprogress'>
                        <h3>{stats.inprogress}</h3>
                        <p>In Progress</p>
                    </div>
                    <div className='stat-card completed'>
                        <h3>{stats.completed}</h3>
                        <p>Completed</p>
                    </div>
                    <div className='stat-card completed'>
                        <h3>{stats.cancelled}</h3>
                        <p>Cancelled</p>
                    </div>
                </div>
            </section>

            <section className='dashoard-section'>
                <h3>Technicians</h3>
                <div className='stats-row'>
                    <div className='stat-card technicians'>
                        <h3>{tech.totalTechnicians}</h3>
                        <p>Total</p>
                    </div>
                    <div className='stat-card available'>
                        <h3>{tech.available}</h3>
                        <p>Available Technicians</p>
                    </div>
                    <div className='stat-card busy'>
                        <h3>{tech.busy}</h3>
                        <p>Busy</p>
                    </div>
                    <div className='stat-card capacity'>
                        <h3>{tech.atCapacity}</h3>
                        <p>At Capacity</p>
                    </div>

                </div>

            </section>

        </section>
    )
}