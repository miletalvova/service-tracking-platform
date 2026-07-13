import { useActiveRequests } from "../hooks/useActiveRequests";
import './Statistics.css'

export default function Statistics() {
    const { requests, loading } = useActiveRequests();
    const activeRequests = requests.length;
    const waiting = requests.filter(request => request.Status?.status === "Created").length;
    const completed = requests.filter(request => request.Status?.status === "Completed").length;
    const highPriority = requests.filter(request => request.priority === "High").length;


     if (loading) {
        return <p>Loading...</p>
    }

    if (requests.length === 0 ) {
        return (
            <div className="statistics-empty">
                <h3>No requests yet</h3>
                <p>Submit your first request to start tracking repairs, technician assignments, and request progress.</p>
            </div>
        )
    }

    return (
        <div className="statistics-card">

            <div className="stat-card">
                <h3>{activeRequests}</h3>
                <p>Active Requests</p>
            </div>

            <div className="stat-card">
                <h3>{waiting}</h3>
                <p>Waiting</p>
            </div>

            <div className="stat-card">
                <h3>{completed}</h3>
                <p>Completed</p>
            </div>

            <div className="stat-card">
                <h3>{highPriority}</h3>
                <p>High Priority</p>
            </div>


        </div>
    )

}