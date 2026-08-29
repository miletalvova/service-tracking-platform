import './RequestDetails.css';
import type { ServiceRequest, UpdateServiceRequest } from '../types/serviceRequest';
import { useEffect, useState, useMemo } from 'react';
import { updateServiceRequest, deleteServiceRequest } from '../api/serviceRequest';
import { getCustomers } from '../api/userApi';
import { getServices } from '../api/serviceApi';
import { getStatuses } from '../api/statusApi';
import { searchAddress } from '../api/locationApi';
import { debounce } from 'lodash';
import type { Customer } from '../types/user';
import type { Service } from '../types/service';
import type { Status } from '../types/status';
import type { LocationSearchResult } from '../types/location';
import axios from 'axios';

type Props = {
    request: ServiceRequest;
    onClose: () => void;
    onUpdated: () => void;
    onDeleted: () => void;
}

export default function RequestDetails({ request, onClose, onUpdated, onDeleted }: Props) {
    const [loadingFormData, setLoadingFormData] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);

    const [editedRequest, setEditedRequest] = useState<UpdateServiceRequest>({
        customerId: request.customerId,
        serviceId: request.serviceId,
        statusId: request.statusId,
        locationId: request.locationId,
        description: request.description,
        priority: request.priority,
    });

    const [address, setAddress] = useState(request.Location?.address ?? '');
    const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<LocationSearchResult | null>(null);
    
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
            const updateData: UpdateServiceRequest = {
                ...editedRequest,
                ...(selectedAddress && {
                    location: selectedAddress
                })
            };

            await updateServiceRequest(request.id, updateData);

            onUpdated();
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

    async function deleteRequest() {
        const confirmed = window.confirm(
            `Are you sure you want to delete request #${request.id}`
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        setError('');

        try {
            await deleteServiceRequest(request.id);
            onDeleted();
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                setError(error?.response?.data?.message ?? 'Failed to delete request')
            } else {
                setError('Failed to delete request')
            }
        } finally {
            setDeleting(false)
        }
    }

    const debounceSearch = useMemo(
        () =>
            debounce(async (value: string) => {
                try {
                    const results = await searchAddress(value);
                    setSuggestions(results);
                } catch (error) {
                    console.error(error);
                }
            }, 1000),
        []
    )

    async function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;

        setAddress(value);
        setSelectedAddress(null);

        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        debounceSearch(value);
    }


    return (
        <section className='request-details'>

            <header className='request-details-header'>
                <div>
                    <h2>Request details</h2>
                </div>

                <button
                    type='button'
                    onClick={onClose}
                    className='done-button'>
                    Close
                </button>
            </header>

            <section className='details-section'>
                <ul>
                    <li>
                        <strong> Service: </strong> {request.Service?.specialization}
                    </li>
                    <li>
                        <strong> Customer: </strong> {request.Customer?.FirstName} { } {request.Customer?.LastName}
                    </li>
                    <li>
                        <strong> Priority: </strong> {request.priority}
                    </li>
                </ul>

                <div className='status-history'>
                    <h3>Status History</h3>
                    {request.StatusHistory?.map(history => (
                        <div key={history.id}>
                            <span>
                                {history.OldStatus?.status ?? 'Created'}
                            </span>

                            <span> → </span>

                            <span>
                                {history.NewStatus?.status ?? 'Created'}
                            </span>

                        </div>
                    ))}
                </div>

            </section>

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
                            id='service'
                            value={editedRequest.serviceId}
                            onChange={(e) =>
                                setEditedRequest({
                                    ...editedRequest,
                                    serviceId: Number(e.target.value)
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
                            id='status'
                            value={editedRequest.statusId}
                            onChange={(e) =>
                                setEditedRequest({
                                    ...editedRequest,
                                    statusId: Number(e.target.value)
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

                    <label htmlFor="description">
                        Description
                    </label>

                    <textarea
                        id='description'
                        value={editedRequest.description}
                        onChange={(e) =>
                            setEditedRequest({
                                ...editedRequest,
                                description: e.target.value
                            })
                        }
                    />

                    <label htmlFor='priority'>
                        Priority
                    </label>

                    <select
                        id="priority"
                        value={editedRequest.priority}
                        onChange={(e) =>
                            setEditedRequest({
                                ...editedRequest,
                                priority: e.target.value as UpdateServiceRequest['priority']
                            })
                        }
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>


                    <label htmlFor="locationId">Location</label>
                    <input value={address} onChange={handleAddressChange} placeholder='Karl Johans gate 1, Oslo' />

                    {suggestions.length > 0 && (
                        <ul className='address-suggestions'>
                            {suggestions.map((item) => (
                                <li
                                    key={item.place_id}
                                    onClick={() => {
                                        setAddress(item.display_name);
                                        setSelectedAddress(item);
                                        setSuggestions([]);
                                    }}
                                >
                                    {item.display_name}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className='request-actions'>

                        <button
                            type='submit'
                            disabled={saving || deleting || loadingFormData}
                            className='edit-button'
                        >

                            {saving
                                ? 'Saving...'
                                : 'Save Changes'}

                        </button>

                        <button
                            type='submit'
                            disabled={saving || deleting}
                            onClick={deleteRequest}
                            className='edit-button'
                        >

                            {deleting
                                ? 'Deleting...'
                                : 'Delete Request'}

                        </button>

                    </div>
                </form>

                {error && (
                    <div className='edit-request-error'>{error}</div>
                )}
            </div>

        </section>
    )
}