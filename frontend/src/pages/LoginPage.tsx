import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { login as loginApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = await loginApi(email, password);
      login(result.token, result.user, result.role);
      console.log(result);

      switch(result.role) {
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
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  const auth = useAuth();
  console.log(auth);

   return (
    <>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default LoginPage;