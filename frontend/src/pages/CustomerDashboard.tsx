import { useServices } from '../hooks/useServices';
import type { Service } from '../types/service';

function CustomerDashboard() {
  const services = useServices();
   return (
    <>
      <h1>Customer Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <h1>Available Services</h1>
              {services.map((service: Service) => (
                <div key={service.id}>
                  <h2>{service.specialization}</h2>
                  <p>{service.description}</p>
                </div>
              ))}
    </>
  );
}

export default CustomerDashboard;