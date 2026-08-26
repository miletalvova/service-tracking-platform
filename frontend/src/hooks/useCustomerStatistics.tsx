import { useState, useEffect } from 'react';
import { getCustomersRequests } from '../api/serviceRequest';
import type { ServiceRequest } from '../types/serviceRequest';

export function useCustomerStatistics() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchStatistics() {
        setLoading(true);

        try {
            const data = await getCustomersRequests('all');

            await new Promise(resolve => setTimeout(resolve, 1500));
            setRequests(data);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStatistics();
    }, []);

    return {
        requests,
        loading,
        refresh: fetchStatistics
    };
}