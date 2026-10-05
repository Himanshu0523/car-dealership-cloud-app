export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand" onClick={() => setActiveTab('home')}>
          <span className="brand-icon">🚗</span>
          <span className="brand-text">Best Cars</span>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeTab === 'dealers' ? 'active' : ''}`}
            onClick={() => setActiveTab('dealers')}
          >
            Dealerships
          </button>
          <button
            className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact
          </button>
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-pill">
              <span className="user-greeting">Hi, <strong>{user.firstName || user.userName}</strong></span>
              <button className="btn-signout" onClick={onLogout}>Sign Out</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className={`btn-auth-link ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`btn-auth-primary ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
