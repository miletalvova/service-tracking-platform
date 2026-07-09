import { useState } from 'react';
import { register as registerApi } from '../api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

import PersonIcon from '@mui/icons-material/Person';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GroupsIcon from '@mui/icons-material/Groups';
import LockIcon from '@mui/icons-material/Lock';


function RegisterPage() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      await registerApi(firstname, lastname, email, username, password, 1);

      setSuccessMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ??
        'Registration failed. PLease try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className='register-page'>

        <div className='register-card'>

          <h1>Create Account</h1>

          <p className='register-subtitle'>Start managing service requests today</p>

          <p className='login-link'>Already have an account? {" "}
            <Link to="/login">Sign In</Link>
          </p>

          <form onSubmit={handleSubmit}>

            <div className='name-row'>

              <div className='form-group'>

                <label htmlFor="firstname">First Name</label>
                <input type="text" placeholder='John' id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />

              </div>

              <div className='form-group'>

                <label htmlFor="lastname">Last Name</label>
                <input type="text" placeholder='Smith' id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required/>

              </div>

            </div>

            <div className='form-group'>

              <label htmlFor="email">Email</label>
              <input type="email" placeholder='john@example.com' id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            
            </div>

            <div className='form-group'>
              
              <label htmlFor="username">Username</label>
              <input type="text" placeholder='johnsmith' id="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            
            </div>

            <div className='form-group'>

              <label htmlFor="password">Password</label>
              <input type="password" placeholder='********' id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}/>
              
              <small>Password must contain at least 8 characters</small>
            </div>

            <div className='role-selection'>

              <h3>Choose your account type</h3>

              <div className='role-card selected'>
                <PersonIcon className='role-icon'/>

              <div>
                <strong>Customer</strong>
                <p>Create and track service requests.</p>
              </div>

              <span className='available'>Available</span>

              </div>

              <div className='role-card disabled'>
                <EngineeringIcon className='role-icon'/>

              <div>
                <strong>Technician</strong>
                <p>Receive assigned jobs and update progress.</p>
              </div>

              <span>
                <LockIcon fontSize='small' />
                Admin Invitation
              </span>

              </div>

              <div className='role-card disabled'>
                <GroupsIcon className='role-icon'/>

              <div>
                <strong>Staff</strong>
                <p>Manage requests and assign technicians.</p>
              </div>

              <span>
                <LockIcon fontSize='small' />
                Admin Invitation
              </span>

              </div>

            </div>

            {successMessage && (
                <div className='success-message'>{successMessage}</div>
              )}
            {errorMessage && (
                <div className='error-message'>{errorMessage}</div>
              )}

            <button className="register-button" disabled={loading}>
              {loading
              ? "Creating Account..."
              : "Create Account"}
              </button>

          </form>

        </div>

      </div>
    </>
  );
}

export default RegisterPage;