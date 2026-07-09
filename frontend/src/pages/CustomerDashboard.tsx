import React, { useState } from 'react';
import CustomerRequests from '../components/CustomerRequests';
import Statistics from '../components/Statistics';
import { useAuth } from '../hooks/useAuth';
import { useActiveRequests } from "../hooks/useActiveRequests";
import { createSmartServiceRequest } from '../api/serviceRequest';
import { searchAddress } from '../api/locationApi';
import { debounce } from 'lodash';
import { useMemo } from 'react';
import './CustomerDashboard.css'

function CustomerDashboard() {
  const { user } = useAuth();

  const { requests, loading: requestsLoading, refresh } = useActiveRequests();

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedAddress) {
      setErrorMessage("Please select an address from the suggestions");
      return;
    }

    try {
      await createSmartServiceRequest(user.id, description, selectedAddress);

      await refresh();

      setSuccessMessage("Service request submitted successfully.");
      setDescription('');
      setAddress('');
      setSelectedAddress(null);

    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
        "Failed to create request."
      );
    } finally {
      setLoading(false);
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
    /* setSelectedAddress(null); */

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }
    debounceSearch(value);
  }

  return (
    <>
      <div className='customer-page'>

        <h1 className='customer-title'>Customer Dashboard</h1>

        <p>Welcome, {user?.username}!</p>

        <Statistics />

        <div className='dashboard-grid'>

          <div className='dashboard-card'>

            <h2>Create Request</h2>

            <form className='request-form' onSubmit={handleSubmit}>

              <div className='form-group'>

                <label htmlFor="description">Describe your request</label>
                <p className='form-hint'>
                  Tell us what happened, and our AI will identify the correct service for you.
                </p>
                <textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className='form-group'>

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
                      >{item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {
                successMessage && (
                  <p className='success-message'>{successMessage}</p>
                )
              }
              {
                errorMessage && (
                  <p className='error-message'>{errorMessage}</p>
                )
              }
              <button className="request-button" type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Request"}</button>
            </form>

          </div>

          <CustomerRequests requests={requests} loading={requestsLoading}/>
        </div>
      </div>
    </>
  );
}

export default CustomerDashboard;