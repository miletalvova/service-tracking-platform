import { useState } from 'react';
import AllRequests from '../components/AllRequests';
import AssignTechnician from '../components/AssignTecnician';
import WorkloadOverview from '../components/Workload';

export default function StaffDashboard() {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <div className="staf-page">
        <h1>Staff Dashboard</h1>

        <div className='staff-grid'>
          <WorkloadOverview />
          <AllRequests
            refreshKey={refreshKey}
            onSelectRequest={setSelectedRequestId} />

          {selectedRequestId && (
            <AssignTechnician
              serviceRequestId={selectedRequestId}
              onAssigned={() => {
                setSelectedRequestId(null);
                setRefreshKey(prev => prev + 1)
              }} />

          )}

        </div>
      </div>
    </>
  );
}