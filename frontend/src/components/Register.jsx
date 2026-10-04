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
            <label>First name</label>
            <input value={form.firstName} onChange={update('firstName')} />
          </div>
          <div>
            <label>Last name</label>
            <input value={form.lastName} onChange={update('lastName')} />
          </div>
        </div>

        <label>Email</label>
        <input type="email" value={form.email} onChange={update('email')} />

        <label>Username</label>
        <input value={form.username} onChange={update('username')} required />

        <label>Password</label>
        <input type="password" value={form.password} onChange={update('password')} required />

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
