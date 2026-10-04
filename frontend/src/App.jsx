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
        <div className="card">
          <h2>Welcome, {user.firstName || user.userName}</h2>
          <p className="muted">You are authenticated.</p>
          <button onClick={handleLogout}>Logout</button>
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
