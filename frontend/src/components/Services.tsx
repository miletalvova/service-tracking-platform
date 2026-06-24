import { useServices } from '../hooks/useServices';
import type { Service } from '../types/service';
import './Services.css'

function Services() {
  const services = useServices();
   return (
    <>
    <div className='services-card'>
      <h1>Available Services</h1>
      <table className='services-table'>
        <thead>
            <tr>
                <th>Service</th> 
                <th>Description</th>
            </tr>
            </thead>
             <tbody>
            {services.map((service: Service) => (
            <tr key={service.id}>
                <td>{service.specialization}</td>
                <td>{service.description}</td>
            </tr>
            ))}
            </tbody>
        </table>
    </div>
    </>
  );
}

export default Services;