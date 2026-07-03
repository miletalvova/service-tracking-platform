import './HomePage.css'
import Services from '../components/Services';
import { useAuth } from '../hooks/useAuth';

function Home() {
  const { role } = useAuth();
  return (
    <>   
      <div className="home-page">
        <div className='home-grid'>
          <div className="home-card">
            <h1 className='home-title'>Service Tracking Platform</h1>
            <p className='home-description'>
              Welcome to the Service Tracking Platform!
              Please log in to access your dashboard.
            </p>
          </div>
          {role === 'Customer' && (
            <div className="home-card">
              <Services />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;