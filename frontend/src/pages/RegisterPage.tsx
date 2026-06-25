import { useState } from 'react';
import { register as registerApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<number>(1);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await registerApi(firstname, lastname, email, username, password, role);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  return (
    <>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">First Name:</label>
          <input type="text" id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        </div>
        <div>
          <label htmlFor="lastname">Last Name:</label>
          <input type="text" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(Number(e.target.value))}>
            <option value="1">Customer</option>
            <option value="2">Staff</option>
            <option value="3">Technician</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default RegisterPage;