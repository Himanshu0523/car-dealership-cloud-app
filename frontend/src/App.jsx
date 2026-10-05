import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Dealerships from './components/Dealerships.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import { logout } from './api.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setActiveTab('home');
  }

  function handleAuthSuccess(userData) {
    setUser(userData);
    setActiveTab('dealers');
  }

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {activeTab === 'home' && (
          <Home
            onExploreDealers={() => setActiveTab('dealers')}
            onLogin={() => setActiveTab('login')}
            user={user}
          />
        )}

        {activeTab === 'dealers' && (
          <Dealerships
            user={user}
            onRequireLogin={() => setActiveTab('login')}
          />
        )}

        {activeTab === 'about' && <About />}

        {activeTab === 'contact' && <Contact />}

        {activeTab === 'login' && (
          <div className="auth-container">
            <Login
              onSwitch={() => setActiveTab('register')}
              onSuccess={handleAuthSuccess}
            />
          </div>
        )}

        {activeTab === 'register' && (
          <div className="auth-container">
            <Register
              onSwitch={() => setActiveTab('login')}
              onSuccess={handleAuthSuccess}
            />
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} Best Cars Dealership Portal — IBM Full-Stack Capstone Project</p>
          <div className="footer-links">
            <button onClick={() => setActiveTab('home')}>Home</button>
            <button onClick={() => setActiveTab('dealers')}>Dealerships</button>
            <button onClick={() => setActiveTab('about')}>About</button>
            <button onClick={() => setActiveTab('contact')}>Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
