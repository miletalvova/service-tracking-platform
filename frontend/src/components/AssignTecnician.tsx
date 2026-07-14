import './AssignTecnician.css';
import { useState, useEffect } from 'react';
import { getRecommendedTechnician } from '../api/jobAssignmentApi'

type Props = {
    serviceRequestId: number;
    onAssigned: () => void
}

export default function AssignTechnician({ serviceRequestId, onAssigned }: Props) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');


    async function handleAIRecommend() {
        setLoading(true);
        setError('');
        try {
            const data = await getRecommendedTechnician(serviceRequestId);
            setResult(data);
            onAssigned();
        } catch (error: any) {
            console.error(error)
            setError(error?.response?.data?.message ?? 'AI recommendation failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='staff-card assign-panel'>
            <h2>Assign Technican</h2>
            <p>Request #{serviceRequestId}</p>

            <button onClick={handleAIRecommend} disabled={loading} className='ai-button'>
                {loading ? 'Finding best technician...' : 'AI Recommend & Assign'}
            </button>


            {result && (
                <div className='success'>
                    <p>Assigned successfully</p>
                </div>
            )}

            {error && <p className='error'>{error}</p>}
        </div>
    )
}