import { useState, useEffect } from 'react';
import { getActiveRequests } from '../api/serviceRequest';
import type { ServiceRequest } from '../types/serviceRequest';

export function useActiveRequests() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchRequests() {
            try {
                const data = await getActiveRequests();
                setRequests(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)
            }
        }
        fetchRequests();
    }, []);

    return {
        requests,
        loading
    };
}