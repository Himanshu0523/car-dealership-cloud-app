import { useState } from 'react';
import { register } from '../api.js';

export default function Register({ onSwitch, onSuccess }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form);
      if (data.status === 'Authenticated') {
        onSuccess?.(data);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Create account</h2>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div>
            <label htmlFor="reg-first-name">First name</label>
            <input
              id="reg-first-name"
              name="firstName"
              autoComplete="given-name"
              value={form.firstName}
              onChange={update('firstName')}
            />
          </div>
          <div>
            <label htmlFor="reg-last-name">Last name</label>
            <input
              id="reg-last-name"
              name="lastName"
              autoComplete="family-name"
              value={form.lastName}
              onChange={update('lastName')}
            />
          </div>
        </div>

        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
        />

        <label htmlFor="reg-username">Username</label>
        <input
          id="reg-username"
          name="username"
          autoComplete="username"
          value={form.username}
          onChange={update('username')}
          required
        />

        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={update('password')}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Register'}
        </button>
      </form>
      <p className="muted">
        Already registered?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Login</a>
      </p>
    </div>
  );
}
