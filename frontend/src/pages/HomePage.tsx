import './HomePage.css'
import Services from '../components/Services';
import { useAuth } from '../hooks/useAuth';
import { Link } from "react-router-dom";
import Statistics from '../components/Statistics';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import BuildIcon from '@mui/icons-material/Build';

function Home() {
  const { role, isAuthenticated } = useAuth();

  const dashboardRoute =
    role === 'Customer'
      ? '/customer'
      : role === 'Staff'
        ? '/staff'
        : role === 'Technician'
          ? '/technician'
          : '/login';

  return (
    <>
      <div className="home-page">

        <section className="hero-section">

          <div className="hero-content">
            <span className='hero-tag'>AI Powered Service Management Platform</span>

            <h1 className='home-title'>Service Tracking Platform</h1>

            <p className='home-description'>
              A modern platform for maintenance companies that combines
              AI-powered request classification, real-time technician assignment and secure role-based dashboards
              into one streamlined workflow.
            </p>
            <div className="hero-buttons">

              {isAuthenticated ? (
                <Link to={dashboardRoute} className="primary-button">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="primary-button">
                    Login
                  </Link>
                  <Link to="/register" className="secondary-button">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {role === 'Customer' && (
          <section className="section">
            <Statistics />
          </section>
        )}

        <section className="section">

          <div className="section-heading">
            <h2>Platform Features</h2>
            <p>
              Designed to automate service management from customer request to job completion.
            </p>
          </div>

          <div className="features-grid">

            <div className="feature-card">
              <AutoAwesomeIcon className="feature-icon" />

              <h3>AI Classification</h3>

              <p>
                Automatically detects the requested service and determines request priority
              </p>
            </div>

            <div className="feature-card">
              <LocationOnIcon className="feature-icon" />

              <h3 >Smart Address Search</h3>
              <p>
                Search addresses using OpenStreetMap with instant autocomplete suggestions.
              </p>
            </div>

            <div className="feature-card">

              <EngineeringIcon className="feature-icon" />

              <h3 >Technician Assignment</h3>
              <p>
                Staff members assign available technicians and monitor workloads.
              </p>
            </div>

            <div className="feature-card">

              <SyncAltIcon className="feature-icon" />

              <h3 >Live Tracking</h3>
              <p>
                Follow requests progress from creation to completion with real-time status updates.
              </p>
            </div>

            <div className="feature-card">
              <SecurityIcon className="feature-icon" />

              <h3>Secure Authentication</h3>

              <p>
                JWT authentication with role-based access control keeps every user limited to their own permissions.
              </p>

            </div>

          </div>
        </section>

        <section className="section">

          <div className="section-heading">
            <h2>How It Works</h2>
            <p>
              A request moves through five simple steps.
            </p>
          </div>

          <div className="timeline">

            <div className="timeline-step">
              <div className="timeline-number">1</div>
              <h3>Create Request</h3>
              <p>Customer submits a new service request.</p>
            </div>

            <div className='timeline-arrow'>→</div>

            <div className="timeline-step">
              <div className="timeline-number">2</div>
              <h3>AI Analysis </h3>
              <p>AI detects the requested service and determines request priority.</p>
            </div>

            <div className='timeline-arrow'>→</div>

            <div className="timeline-step">
              <div className="timeline-number">3</div>
              <h3>Assignment</h3>
              <p>Staff assigns an available technician to the request.</p>
            </div>

            <div className='timeline-arrow'>→</div>

            <div className="timeline-step">
              <div className="timeline-number">4</div>
              <h3>Progress</h3>
              <p>Technician updates the request status as work progresses.</p>
            </div>

            <div className='timeline-arrow'>→</div>

            <div className="timeline-step">
              <div className="timeline-number">5</div>
              <h3>Completed</h3>
              <p>Customer follows progress until completion.</p>
            </div>

          </div>

        </section>

        <section className="section">

          <div className="section-heading">
            <h2>User Roles</h2>
            <p>
              Every user has access to a dedicated dashboard.
            </p>
          </div>

          <div className="roles-grid">

            <div className="role-card">
              <PersonIcon className="role-icon" />

              <h3>Customer</h3>

              <ul>
                <li>Create requests</li>
                <li>Track progress</li>
                <li>Receive updates</li>
              </ul>
            </div>

            <div className="role-card">
              <GroupsIcon className="role-icon" />

              <h3>Staff</h3>

              <ul>
                <li>Manage requests</li>
                <li>Assign technicians</li>
                <li>Monitor workloads</li>
              </ul>

            </div>

            <div className="role-card">
              <BuildIcon className="role-icon" />

              <h3>Technician</h3>

              <ul>
                <li>View assigned jobs</li>
                <li>Update status</li>
                <li>Complete work</li>
              </ul>

            </div>
          </div>
        </section>

        <section className="section">

          <div className="section-heading">
            <h2>Technology Stack</h2>
            <p>Technologies used to build the platform</p>
          </div>

          <div className="stack-grid">

            <div className="stack-card">
              <h2>Backend</h2>

              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>TypeScript</li>
                <li>Sequelize</li>
              </ul>
            </div>

            <div className="stack-card">
              <h2>Frontend</h2>

              <ul>
                <li>React</li>
                <li>TypeScript</li>
              </ul>
            </div>

            <div className="stack-card">
              <h2>Database</h2>

              <ul>
                <li>MySQL</li>
              </ul>
            </div>

            <div className="stack-card">
              <h2>Infrastructure</h2>

              <ul>
                <li>Docker</li>
                <li>JWT</li>
              </ul>
            </div>

            <div className="stack-card">
              <h2>Integrations</h2>

              <ul>
                <li>Claude API</li>
                <li>OpenStreetMap</li>
              </ul>
            </div>

          </div>

        </section>

        {role === 'Customer' && (
          <section className="section">

            <div className="section-heading">
              <h2>Available Services</h2>
              <p>
                Browse supported maintenance services.
              </p>
            </div>

            <Services />
          </section>
        )}

        <section className="section">

          <h2>Ready to get started?</h2>

          <p>Create your first service request!</p>

          <Link className='get-started-button' to={dashboardRoute}>
          {isAuthenticated ? 'Go to Dashboard' : 'Create an Account'}
          </Link>
        </section>

      </div>
    </>
  );
}

export default Home;