import { useState } from 'react';
import { register } from '../api.js';

export default function Register({ onSwitch, onSuccess }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function triggerShake() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }

  // Password strength calculation
  const pw = form.password;
  const hasLength = pw.length >= 8;
  const hasNumber = /\d/.test(pw);
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const strengthScore = [hasLength, hasNumber, hasLetter, hasSpecial].filter(Boolean).length;

  let strengthLabel = 'Too weak';
  let strengthColor = '#ef4444';
  if (strengthScore === 2) {
    strengthLabel = 'Fair';
    strengthColor = '#f59e0b';
  } else if (strengthScore === 3) {
    strengthLabel = 'Good';
    strengthColor = '#3b82f6';
  } else if (strengthScore >= 4) {
    strengthLabel = 'Strong';
    strengthColor = '#10b981';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.username.trim()) {
      setError('Please choose a username.');
      triggerShake();
      return;
    }

    if (!form.password) {
      setError('Please enter a secure password.');
      triggerShake();
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      triggerShake();
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userName: form.username.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
      };
      const data = await register(payload);
      if (data.status === 'Authenticated') {
        onSuccess?.(data);
      } else {
        setError(data.message || data.error || 'Registration failed. That username may already be taken.');
        triggerShake();
      }
    } catch (err) {
      setError(err.message || 'Server error occurred during account creation.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`auth-card ${isShaking ? 'shake' : ''}`}>
      <div className="auth-header">
        <div className="auth-icon-badge">✨</div>
        <h2>Create an Account</h2>
        <p className="auth-subtitle">
          Join the Best Cars community to review dealerships, track car ratings, and share feedback.
        </p>
      </div>

      {error && (
        <div className="alert-banner error auth-alert" role="alert">
          <span className="alert-icon">⚠️</span>
          <span className="alert-msg">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate={false}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reg-first-name">First name</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                id="reg-first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Jane"
                value={form.firstName}
                onChange={update('firstName')}
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reg-last-name">Last name</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                id="reg-last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Doe"
                value={form.lastName}
                onChange={update('lastName')}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email address</label>
          <div className="input-with-icon">
            <span className="input-icon">✉️</span>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane.doe@example.com"
              value={form.email}
              onChange={update('email')}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reg-username">
            <span>Username</span>
            <span className="required-star">*</span>
          </label>
          <div className="input-with-icon">
            <span className="input-icon">🏷️</span>
            <input
              id="reg-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Choose a unique username"
              value={form.username}
              onChange={update('username')}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">
            <span>Password</span>
            <span className="required-star">*</span>
          </label>
          <div className="input-with-icon">
            <span className="input-icon">🔑</span>
            <input
              id="reg-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={update('password')}
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

          {form.password && (
            <div className="pw-strength-box">
              <div className="pw-strength-bar">
                <div
                  className="pw-strength-fill"
                  style={{
                    width: `${Math.max(15, (strengthScore / 4) * 100)}%`,
                    backgroundColor: strengthColor,
                  }}
                />
              </div>
              <div className="pw-strength-info">
                <span>Strength: <strong style={{ color: strengthColor }}>{strengthLabel}</strong></span>
                <span className="pw-hints">
                  {hasLength ? '✓ 8+ chars' : '• 8+ chars'} |{' '}
                  {hasNumber ? '✓ Number' : '• Number'} |{' '}
                  {hasSpecial ? '✓ Symbol' : '• Symbol'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm-password">
            <span>Confirm Password</span>
            <span className="required-star">*</span>
          </label>
          <div className="input-with-icon">
            <span className="input-icon">🔒</span>
            <input
              id="reg-confirm-password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-type your password"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              required
              disabled={loading}
            />
          </div>
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <span className="field-hint error-text">⚠️ Passwords do not match</span>
          )}
        </div>

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? (
            <span className="btn-loading-flex">
              <span className="btn-spinner" />
              <span>Creating Account…</span>
            </span>
          ) : (
            'Complete Registration →'
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="link-switch"
            onClick={onSwitch}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}
