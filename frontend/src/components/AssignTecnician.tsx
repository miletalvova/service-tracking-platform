import './AssignTecnician.css';
import { useState } from 'react';
import { getRecommendedTechnician } from '../api/jobAssignmentApi';
import type { JobAssignment } from '../types/jobAssignment';
import type { ServiceRequest } from '../types/serviceRequest';
import axios from 'axios';

type Props = {
    request: ServiceRequest;
    onAssigned: () => void
}

export default function AssignTechnician({ request, onAssigned }: Props) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<JobAssignment | null>(null);
    const [error, setError] = useState('');


    async function handleAIRecommend() {
        setLoading(true);
        setError('');

        try {
            const data = await getRecommendedTechnician(request.id);

            setResult(data);
            onAssigned();
        } catch (error: unknown) {
            console.error(error)
            if (axios.isAxiosError(error)) {
                setError(error?.response?.data?.message ?? 'AI recommendation failed')
            } else {
                setError('AI recommendation failed')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='assignment-card'>

            <header className='assignment-header'>

                <div>
                    <p className='assignment-eyebrow'>
                        DISPATCH
                    </p>

                    <h2>Assign Technican</h2>

                    <p className='assignment-request-id'>Service Request #{request.id}</p>
                </div>
            </header>

            <div className='assignment-content'>

                <div className='assignment-request'>

                    <div className='assignmment-section-title'>
                        Request Details
                    </div>

                    <div className='request-main-info'>

                        <div>
                            <span className='info-label'>
                                Service
                            </span>

                            <strong>
                                {request.Service?.specialization ?? '—'}
                            </strong>
                        </div>

                        <div>
                            <span className='info-label'>
                                Customer
                            </span>

                            <strong>
                                {request.Customer
                                    ? `${request.Customer.FirstName} ${request.Customer.LastName}`
                                    : '—'}

                            </strong>
                        </div>

                        <div>
                            <span className='info-label'>
                                Priority
                            </span>

                            <span className={`request-priority ${request.priority.toLocaleLowerCase()}`}
                            >
                                <span className='priority-dot' />
                                    {request.priority}
                            </span>
                        </div>

                        <div>
                            <span className='info-label'>
                                Status
                            </span>

                            <span className={`status ${request.Status?.status.replace(/\s+/g, '').toLocaleLowerCase()}`}>
                                {request.Status?.status}
                            </span>
                        </div>
                    </div>

                    {request.description && (
                        <div className='request-description'>

                            <span className='info-label'>
                                Description
                            </span>

                            <p>{request.description}</p>

                        </div>
                    )}

                </div>

                <div className='ai-assignment'>

                    <div className='assignment-section-title'>
                        AI DISPATCH
                    </div>

                    <p className='ai-description'>
                        Find the best available technician based on workload, availability, skills, and the service request.
                    </p>

                    <button
                        type='button'
                        onClick={handleAIRecommend}
                        disabled={loading}
                        className='ai-button'
                    >
                        {loading
                            ? 'Finding best technician...'
                            : 'AI Recommend & Assign'}
                    </button>

                    {result && (
                        <div className='assignment-success'>
                            <strong>Technician assigned successfully</strong>

                            <span>Assignment #{result.id}</span>
                        </div>
                    )}

                    {error && (
                        <div className='assignment-error'>{error}</div>
                    )}

                </div>

            </div>
        </section >
    )
}