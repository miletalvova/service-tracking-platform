import { useState, useEffect } from 'react';
import { getActiveRequests } from '../api/serviceRequest';
import type { ServiceRequest } from '../types/serviceRequest';

export function useActiveRequests() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchRequests() {
            try {
                const data = await getActiveRequests();
                setRequests(data);
            } finally {
                setLoading(false)
            }
        }

    useEffect(() => {
        fetchRequests();
    }, []);

    return {
        requests,
        loading,
        refresh: fetchRequests
    };
}