import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { login as loginApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const result = await loginApi(email, password);

      login(result.token, result.user, result.role);

      setTimeout(() => {
        switch (result.role) {
          case 'Customer':
            navigate('/customer');
            break;

          case 'Staff':
            navigate('/staff');
            break;

          case 'Technician':
            navigate('/technician');
            break;
          default:
            navigate('/');
        }
      }, 3000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ??
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className='login-page'>

        <div className="login-card">

          <h1>Login</h1>

          <form className="login-form" onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="email">Email</label>
              <input type="email" placeholder='john@example.com' id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            </div>

            <div className="form-group">

              <label htmlFor="password">Password</label>
              <input type="password" placeholder='********' id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            </div>

            {errorMessage && (
              <div className='error-message'>{errorMessage}</div>
            )}

            <button className="login-button" type="submit" disabled={loading}>
              Login
            </button>

          </form>

        </div>

      </div>
    </>
  );
}

export default LoginPage;