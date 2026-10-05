import { useState } from 'react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import { logout } from './api.js';

export default function App() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  if (user) {
    return (
      <div className="wrapper">
        <div className="card dashboard-card">
          <div className="auth-header">
            <span className="status-badge">Authenticated</span>
            <h2>Welcome, {user.firstName || user.userName}!</h2>
            <p className="user-meta">Signed in as <strong>@{user.userName}</strong></p>
          </div>

          <div className="next-steps">
            <h3>Next Steps</h3>
            <p className="text-sm">You are now authenticated and can post reviews and explore all features.</p>
            
            <div className="action-grid">
              <a href="/dealers/" className="btn-action primary">
                <span className="icon">🏪</span>
                <div>
                  <strong>Browse Dealerships</strong>
                  <small>View 50-state directory & read reviews</small>
                </div>
              </a>

              <a href="/about/" className="btn-action">
                <span className="icon">ℹ️</span>
                <div>
                  <strong>About Best Cars</strong>
                  <small>Learn about our portal architecture</small>
                </div>
              </a>

              <a href="/contact/" className="btn-action">
                <span className="icon">✉️</span>
                <div>
                  <strong>Contact Support</strong>
                  <small>Reach out to our customer team</small>
                </div>
              </a>
            </div>
          </div>

          <div className="card-footer">
            <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      {mode === 'login' ? (
        <Login onSwitch={() => setMode('register')} onSuccess={setUser} />
      ) : (
        <Register onSwitch={() => setMode('login')} onSuccess={setUser} />
      )}
    </div>
  );
}
