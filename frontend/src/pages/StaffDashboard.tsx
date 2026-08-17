import './StaffDashboard.css';
import { useState } from 'react';
import AllRequests from '../components/AllRequests';
import AssignTechnician from '../components/AssignTecnician';
import WorkloadOverview from '../components/Workload';

export default function StaffDashboard() {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <div className="staff-page">
        <header className="staff-header">
          <div>
            <p className="staff-eyebrow">OPERATIONS</p>
            <h1 className="staff-title">Service Operations</h1>
            <p className="staff-subtitle">Monitor incoming requests, technician workload, and active assignments.</p>
          </div>
        </header>

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