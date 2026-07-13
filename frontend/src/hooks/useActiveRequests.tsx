import { useState, useEffect } from 'react';
import { getCustomersRequests } from '../api/serviceRequest';
import type { ServiceRequest } from '../types/serviceRequest';

export function useActiveRequests() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'active' | 'history'>('active');

    async function fetchRequests(status: 'active' | 'history') {
        setLoading(true);

        try {
            const data = await getCustomersRequests(status);
            setRequests(data);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests(view);
    }, [view]);

    return {
        requests,
        loading,
        view,
        setView,
        refresh: () => fetchRequests(view)
    };
}