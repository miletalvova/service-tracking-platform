import { useState, useEffect } from 'react';
import { getServices } from '../api/serviceApi';
import type { Service } from '../types/service';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
    useEffect(() => {
        getServices()
        .then((data) => { setServices(data);
        }).catch((error) => {      
            console.error('There was an error fetching the data:', error);
        });
    }, []);
    return services;
}