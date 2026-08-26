import './Statistics.css';
import type { ServiceRequest } from '../types/serviceRequest';

type StatisticsProps = {
    requests: ServiceRequest[];
    loading: boolean;
};

export default function Statistics({ requests, loading }: StatisticsProps) {
    const activeRequests = requests.filter(
        request =>
            request.Status?.status !== 'Completed' &&
            request.Status?.status !== 'Cancelled'
    ).length;
    const waiting = requests.filter(request => request.Status?.status === "Created").length;
    const completed = requests.filter(request => request.Status?.status === "Completed").length;
    const highPriority = requests.filter(request => request.priority === "High").length;


    if (loading) {
        return (
            <section className='statistics-grid'>
                <div className="stat-card stat-active">
                    <div className='skeleton skeleton-label' />
                    <div className='skeleton skeleton-value' />
                </div>

                <div className="stat-card stat-waiting">
                    <div className='skeleton skeleton-label' />
                    <div className='skeleton skeleton-value' />
                </div>

                <div className="stat-card stat-completed">
                    <div className='skeleton skeleton-label' />
                    <div className='skeleton skeleton-value' />
                </div>

                <div className="stat-card stat-priority">
                    <div className='skeleton skeleton-label' />
                    <div className='skeleton skeleton-value' />
                </div>
            </section>
        )
    }

    return (
        <section className='statistics-grid'>

            <div className="stat-card stat-active">
                <div className='stat-label'>Active Requests</div>
                <div className='stat-value'>{activeRequests}</div>
            </div>

            <div className="stat-card stat-waiting">
                <div className='stat-label'>Waiting</div>
                <div className='stat-value'>{waiting}</div>
            </div>

            <div className="stat-card stat-completed">
                <div className='stat-label'>Completed</div>
                <div className='stat-value'>{completed}</div>
            </div>

            <div className="stat-card stat-priority">
                <div className='stat-label'>High Priority</div>
                <div className='stat-value'>{highPriority}</div>
            </div>

        </section>
    )

}