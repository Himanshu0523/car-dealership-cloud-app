import { useState } from 'react';
import { login } from '../api.js';

export default function Login({ onSwitch, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  function triggerShake() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }

  function handleDemoFill() {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const data = await login(username.trim(), password);
      if (data.status === 'Authenticated') {
        onSuccess?.(data);
      } else {
        setError(data.message || 'Invalid username or password. Please try again.');
        triggerShake();
      }
    } catch (err) {
      setError(err.message || 'Server error occurred during sign in.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`auth-card ${isShaking ? 'shake' : ''}`}>
      <div className="auth-header">
        <div className="auth-icon-badge">🔐</div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">
          Sign in to submit verified dealership reviews, view analytics, and explore inventory.
        </p>
      </div>

      {error && (
        <div className="alert-banner error auth-alert" role="alert">
          <span className="alert-icon">⚠️</span>
          <span className="alert-msg">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate={false}>
        <div className="form-group">
          <label htmlFor="login-username">
            <span>Username</span>
            <span className="required-star">*</span>
          </label>
          <div className="input-with-icon">
            <span className="input-icon">👤</span>
            <input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="e.g. jdoe or admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </div>
        </div>

        <div className="form-group">
          <div className="label-row">
            <label htmlFor="login-password">
              <span>Password</span>
              <span className="required-star">*</span>
            </label>
          </div>
          <div className="input-with-icon">
            <span className="input-icon">🔑</span>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="btn-toggle-pw"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? (
            <span className="btn-loading-flex">
              <span className="btn-spinner" />
              <span>Signing In…</span>
            </span>
          ) : (
            'Sign In to Portal →'
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <button
        type="button"
        className="btn-demo-fill"
        onClick={handleDemoFill}
        disabled={loading}
      >
        ⚡ Quick Fill Demo Account (admin)
      </button>

      <div className="auth-footer">
        <p>
          Don't have an account yet?{' '}
          <button
            type="button"
            className="link-switch"
            onClick={onSwitch}
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
