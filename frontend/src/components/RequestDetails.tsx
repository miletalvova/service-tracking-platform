import './RequestDetails.css';
import type { ServiceRequest } from '../types/serviceRequest';
import { useEffect, useState } from 'react';
/* import { updateServiceRequest } from '../api/serviceRequest'; */
import { getCustomers } from '../api/userApi';
import { getServices } from '../api/serviceApi';
import { getStatuses } from '../api/statusApi';
import type { Customer } from '../types/user';
import type { Service } from '../types/service';
import type { Status } from '../types/status';
import axios from 'axios';

type Props = {
    request: ServiceRequest;
    onClose: () => void;
}

export default function RequestDetails({ request, onClose }: Props) {
    const [loadingFormData, setLoadingFormData] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [editedRequest, setEditedRequest] = useState<ServiceRequest>(request);


    useEffect(() => {
        async function fetchFormData() {
            setLoadingFormData(true);
            setError('');

            try {
                const [customer, services, statuses] = await Promise.all([
                    getCustomers(),
                    getServices(),
                    getStatuses()
                ]) 
                setCustomers(customer);
                setServices(services);
                setStatuses(statuses);
            } catch (error: unknown) {
                console.error(error);

                if (axios.isAxiosError(error)) {
                    setError(error?.response?.data?.message ?? 'Failed to load customers')
                } else {
                    setError('Failed to load customers')
                }
            } finally {
                setLoadingFormData(false)
            }
        }
        fetchFormData();
    }, [])

    async function editRequest(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setSaving(true);
        setError('');

        try {
            /* await updateServiceRequest(request.id, editedRequest); */
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                setError(error?.response?.data?.message ?? 'Failed to update request')
            } else {
                setError('Failed to update request')
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <section className='request-details'>

            <header className='request-details-header'>
                <div>
                    <h2>Request details</h2>
                </div>
            </header>

            <div className='request-details-wrapper'>

                <div className='request-details'>
                    <p></p>

                </div>

            </div>

            <div className='edit-interface'>
                <form className='request-form' onSubmit={editRequest}>
                    <div className='form-group'>
                        <label htmlFor='customer'>Choose customer</label>
                        <select
                            id='customer'
                            value={editedRequest.customerId}
                            onChange={(e) =>
                                setEditedRequest({
                                    ...editedRequest,
                                    customerId: Number(e.target.value)
                                })
                            }
                        >
                            {loadingFormData ? (
                                <option>Loading customers...</option>
                            ) : (
                                customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.FirstName} {customer.LastName}</option>
                                ))
                            )}

                        </select>

                        <label htmlFor='customer'>Choose service</label>
                        <select
                            id='services'
                            value={editedRequest.serviceId}
                            onChange={(e) =>
                                setEditedRequest({
                                    ...editedRequest,
                                    customerId: Number(e.target.value)
                                })
                            }
                        >
                            {loadingFormData ? (
                                <option>Loading services...</option>
                            ) : (
                                services.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.specialization} {service.description}</option>
                                ))
                            )}

                        </select>

                        <label htmlFor='customer'>Choose status</label>
                        <select
                            id='services'
                            value={editedRequest.statusId}
                            onChange={(e) =>
                                setEditedRequest({
                                    ...editedRequest,
                                    customerId: Number(e.target.value)
                                })
                            }
                        >
                            {loadingFormData ? (
                                <option>Loading statuses...</option>
                            ) : (
                                statuses.map(status => (
                                    <option key={status.id} value={status.id}>
                                        {status.status}</option>
                                ))
                            )}

                        </select>
                    </div>


                    <button
                        type='submit'
                        disabled={saving}
                        className='edit-button'
                    >

                        {saving
                            ? 'Editing the request...'
                            : 'Edit Request'}

                    </button>
                </form>

                <button
                    type='button'
                    onClick={onClose}
                    className='done-button'>
                    Close
                </button>

                {error && (
                    <div className='edit-request-error'>{error}</div>
                )}
            </div>

        </section>
    )
}