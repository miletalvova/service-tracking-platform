import './StaffDashboard.css';
import { useEffect, useState } from 'react';
import AllRequests from '../components/AllRequests';
import AssignTechnician from '../components/AssignTecnician';
import WorkloadOverview from '../components/Workload';
import { getServiceRequests } from '../api/serviceRequest';
import type { ServiceRequest } from '../types/serviceRequest';
import type { DashboardStats } from '../types/technician';

import RefreshIcon from '@mui/icons-material/Refresh';

export default function StaffDashboard() {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

   const [stats, setStats] = useState<DashboardStats>({
          created: 0,
          assigned: 0,
          inprogress: 0,
          completed: 0,
          cancelled: 0
      })

      useEffect(() => {
          async function fetchDashboardStats() {
              try {
                const requests = await getServiceRequests("all");
                setStats({
                    created: requests.filter((r: ServiceRequest) => r.Status?.status === 'Created').length,
                    assigned: requests.filter((r: ServiceRequest) => r.Status?.status === 'Assigned').length,
                    inprogress: requests.filter((r: ServiceRequest) => r.Status?.status === 'In Progress').length,
                    completed: requests.filter((r: ServiceRequest) => r.Status?.status === 'Completed').length,
                    cancelled: requests.filter((r: ServiceRequest) => r.Status?.status === 'Cancelled').length
                });
              } catch (error) {
                console.error('Error fetching dashboard stats:', error);
              }
            }

            fetchDashboardStats();
      }, [refreshKey]);

  return (
    <>
      <div className="staff-page">
        <header className="staff-header">
          <div>
            <p className="staff-eyebrow">OPERATIONS</p>
            <h1 className="staff-title">Service Operations</h1>
            <p className="staff-subtitle">Monitor incoming requests, technician workload, and active assignments.</p>
          </div>

          <button className="staff-refresh-button" onClick={() => setRefreshKey(prev => prev + 1)}>
            <RefreshIcon className="staff-refresh-icon" />
            Refresh
          </button>
        </header>

        <section className="kpi-grid">
          <div className="kpi-card kpi-created">
            <div className='kpi-label'>New Requests</div>
            <div className='kpi-value'>{stats.created}</div>
            <div className='kpi-description'>Requests that have been submitted but not yet assigned</div>
          </div>
          <div className="kpi-card kpi-assigned">
            <div className='kpi-label'>Assigned</div>
            <div className='kpi-value'>{stats.assigned}</div>
            <div className='kpi-description'>Requests that have been assigned to a technician</div>
          </div>
          <div className="kpi-card kpi-inprogress">
            <div className='kpi-label'>In Progress</div>
            <div className='kpi-value'>{stats.inprogress}</div>
            <div className='kpi-description'>Requests that are currently being worked on</div>
          </div>
          <div className="kpi-card kpi-completed">
            <div className='kpi-label'>Completed</div>
            <div className='kpi-value'>{stats.completed}</div>
            <div className='kpi-description'>Requests that have been completed</div>
          </div>
        </section>

        <div className='staff-grid'>
          <section className='workload-section'>
            <WorkloadOverview />
          </section>

          <section className='requests-section'>
            <AllRequests
              refreshKey={refreshKey}
              onSelectRequest={setSelectedRequestId} />
          </section>

          {selectedRequestId && (
            <section className='assignment-section'>
              <AssignTechnician
                serviceRequestId={selectedRequestId}
                onAssigned={() => {
                  setSelectedRequestId(null);
                  setRefreshKey(prev => prev + 1)
                }} />
            </section>
          )}
        </div>
      </div>
    </>
  );
}