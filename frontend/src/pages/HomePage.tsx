import './HomePage.css'
import Services from '../components/Services';

function Home() {
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

          <Services />
        </div>
      </div>
    </>
  );
}

export default Home;