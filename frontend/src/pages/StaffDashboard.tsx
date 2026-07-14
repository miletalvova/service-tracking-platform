import { useState } from 'react';
import AllRequests from '../components/AllRequests';
import AssignTechnician from '../components/AssignTecnician'

export default function StaffDashboard() {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  return (
    <>
      <div className="staf-page">
        <h1>Staff Dashboard</h1>

        <div className='staff-grid'>
          <AllRequests onSelectRequest={setSelectedRequestId} />

          {selectedRequestId && (
            <AssignTechnician
              serviceRequestId={selectedRequestId}
              onAssigned={() => setSelectedRequestId(null)} />

          )}

        </div>
      </div>
    </>
  );
}